import { IncomingMessage, ServerResponse, RequestListener } from 'http'
import fetch from 'node-fetch'
import buildPagesContext from './pages/pagesContext'
import { getPage, Page } from './pages'
import logger from './logging'
import { DocumentNode, parse, visit, print } from 'graphql'

const FRINGE_CACHE = 'fringe_cache'

const buildHandler = async (source: string, pattern: RegExp) => {
  try {
    logger.info('Building the page context for all files')

    const pagesContext = await buildPagesContext(source, pattern)

    const main: RequestListener = async (
      req: IncomingMessage,
      res: ServerResponse,
    ) => {
      const result = await processRequest(pagesContext, req)
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
): Promise<any> => {
  const normalizedPathname = normalizePathname(req.url)

  if (pageIsApi(normalizedPathname)) {
    return processApiRequests(normalizedPathname, pagesContext)
  }

  if (pageIsGraphql(normalizedPathname)) {
    return processGraphQLRequests(normalizedPathname, pagesContext)
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
) => {
  const page = await getPage(normalizedPathname, pagesContext, true)
  if (!page) return null

  const response = await executeGQL(page.context, {})

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

async function executeGQL(graphqlQuery: string, variables = {}) {
  try {
    const ast: DocumentNode = parse(graphqlQuery)
    const { updatedAST, cacheFields } = extractCacheKeyFields(ast)
    const result = await fetch('https://api.spacex.land/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `${print(updatedAST)}`,
        variables,
      }),
    })
    let response = await result.json()

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

export default buildHandler
