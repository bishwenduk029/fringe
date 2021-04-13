import { IncomingMessage, ServerResponse, RequestListener } from 'http'
import fetch from 'node-fetch'
import buildPagesContext from './pages/pagesContext'
import { getPage, Page } from './pages'
import logger from './logging'
import { Cache, normalize, merge, denormalize } from 'cache'
import { DocumentNode } from 'graphql'

interface FringeResponse {
  headers: any
  response: any
}

const buildHandler = async (source: string, pattern: RegExp, cache: Cache) => {
  try {
    logger.info('Building the page context for all files')

    const pagesContext = await buildPagesContext(source, pattern)

    const main: RequestListener = async (
      req: IncomingMessage,
      res: ServerResponse,
    ) => {
      const result = await processRequest(pagesContext, req, cache)
      if (result) {
        Object.keys(result.headers || []).forEach(header => {
          res.setHeader(header, result.headers[header])
        })
        res.end(result.response)

        return
      }
      res.end(`Page not found: ${req.url}`)
    }
    logger.info('Handler is ready now starting the server')

    return main
  } catch (error) {
    logger.error(JSON.stringify(error))
  }
}

export const buildCloudflareWorkerHandler = async (
  source: string,
  pattern: RegExp,
  cache: Cache,
) => {
  try {
    logger.info('Building the page context for all files')

    const pagesContext = await buildPagesContext(source, pattern)
    const main = async request => {
      const result = await processRequest(pagesContext, request, cache)
      return new Response(result.response, {
        headers: result.headers,
      })
    }
    return main
  } catch (error) {
    logger.error(JSON.stringify(error))
  }
}

const processRequest = async (
  pagesContext: string[],
  req: any,
  cache: Cache,
): Promise<FringeResponse> => {
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

  return { response, headers: { 'Content-Type': 'application/json' } }
}

const processGraphQLRequests = async (
  normalizedPathname: string,
  pagesContext: string[],
  cache: Cache,
) => {
  const page = await getPage(normalizedPathname, pagesContext)
  if (!page) return null

  const response = await executeGQL(page.context, {}, cache)

  return { response, headers: { 'Content-Type': 'application/json' } }
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

async function executeGQL(
  { updatedAST, cacheFields, graphQLString }: any,
  variables = {},
  cache: Cache,
) {
  try {
    let response = await getFromCache(cache, updatedAST)
    if (!response || !response.data) {
      const result = await fetch('https://api.spacex.land/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: graphQLString,
          variables,
        }),
      })
      response = await result.json()
      const getKey = obj =>
        `${obj.__typename}:${cacheFields
          .map(cacheField => obj[cacheField])
          .join(':')}`
      const normMap = normalize(updatedAST, undefined, response.data, getKey)
      await merge(cache, normMap)
    }

    return JSON.stringify(response.data)
  } catch (error) {
    logger.error(error)
  }
}

async function getFromCache(cache: Cache, query: DocumentNode) {
  const denormResult = await denormalize(query, {}, cache)

  const setToJSON = (k, v) => (v instanceof Set ? Array.from(v) : v)
  return JSON.parse(JSON.stringify(denormResult, setToJSON))
}

export default buildHandler
