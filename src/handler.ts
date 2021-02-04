import { IncomingMessage, ServerResponse, RequestListener } from 'http'
import fetch from 'node-fetch'
import buildPagesContext from './pages/pagesContext'
import { getPage, Page } from './pages'
import logger from './logging'
import RedisCache from 'cache/implementations/RedisCache'
import { Cache, normalize, merge, denormalize } from 'cache'
import { DocumentNode, parse, visit, print } from 'graphql'

const FRINGE_CACHE = 'fringe_cache'

const buildHandler = async (source: string, pattern: RegExp) => {
  try {
    logger.info('Building the page context for all files')

    const pagesContext = await buildPagesContext(source, pattern)

    logger.info('Setting up Redis Cache')
    let cache: Cache = new RedisCache()

    const main: RequestListener = async (
      req: IncomingMessage,
      res: ServerResponse,
    ) => {
      const result = await processRequest(pagesContext, req, cache)
      if (!result) {
        res.end(`Page not found: ${req.url}`)
      }
      res.end(result)
    }

    return main
  } catch (error) {
    logger.error(JSON.stringify(error))
  }
}

const processRequest = async (
  pagesContext: string[],
  req: IncomingMessage,
  cache: Cache,
): Promise<any> => {
  const normalizedPathname = normalizePathname(req.url)

  if (pageIsApi(normalizedPathname)) {
    return processApiRequests(normalizedPathname, pagesContext)
  }

  if (pageIsGraphql(normalizedPathname)) {
    return processGraphQLRequests(normalizedPathname, pagesContext, cache)
  }
}

const processApiRequests = async (
  normalizedPathname: string,
  pagesContext: string[],
) => {
  const page: Page = await getPage(normalizedPathname, pagesContext)
  if (!page) return null

  const response = await page.context.default()

  return response
}

const processGraphQLRequests = async (
  normalizedPathname: string,
  pagesContext: string[],
  cache: Cache,
) => {
  const page = await getPage(normalizedPathname, pagesContext, true)
  if (!page) return null

  const response = await executeGQL(page.context, {}, cache)

  return response
}

function normalizePathname(pathname) {
  return pathname === '/' || /graphql$/.test(pathname) ? '/index' : pathname
}

function pageIsApi(page) {
  return page.indexOf('/api/') >= 0
}

function pageIsGraphql(page) {
  return page.indexOf('/graphql/') >= 0
}

async function executeGQL(graphqlQuery: string, variables = {}, cache: Cache) {
  try {
    const ast: DocumentNode = parse(graphqlQuery)
    const { updatedAST, cacheFields } = extractCacheKeyFields(ast)
    let response = getFromCache(cache, updatedAST)
    console.log(JSON.stringify(response))
    if (!response || !response.data) {
      console.log('oh no cache miss')
      const result = await fetch('https://api.spacex.land/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `${print(updatedAST)}`,
          variables,
        }),
      })
      response = await result.json()
      const getKey = obj =>
        `${obj.__typename}:${cacheFields
          .map(cacheField => obj[cacheField])
          .join(':')}`
      const normMap = normalize(updatedAST, undefined, response.data, getKey)
      merge(cache, normMap)
    }

    return JSON.stringify(response.data)
  } catch (error) {
    logger.error(error)
  }
}

export function extractCacheKeyFields(ast: DocumentNode) {
  let cacheFields = []
  let visitor = {
    Field(node) {
      if (node.directives.length) {
        cacheFields = node.directives.reduce(
          (cacheFields: string[], directive: any) => {
            if (directive.name.value === FRINGE_CACHE)
              return [...cacheFields, node.name.value]
          },
          cacheFields,
        )
        return {
          ...node,
          directives: node.directives.filter(
            directive => directive.name.value !== FRINGE_CACHE,
          ),
        }
      }
    },
  }
  const updatedAST: DocumentNode = visit(ast, visitor)
  return { updatedAST, cacheFields }
}

function getFromCache(cache: Cache, query: DocumentNode) {
  const denormResult = denormalize(query, {}, cache)

  const setToJSON = (k, v) => (v instanceof Set ? Array.from(v) : v)
  return JSON.parse(JSON.stringify(denormResult, setToJSON))
}

export default buildHandler
