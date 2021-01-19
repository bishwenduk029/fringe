import { RequestHandler } from 'micro'
import { IncomingMessage, ServerResponse } from 'http'
import buildPagesContext from './pages/pagesContext'
import { getPage, Page } from './pages'
import logger from 'logging'

const buildHandler = async (
  source: string,
  pattern: RegExp,
): Promise<RequestHandler> => {
  try {
    logger.info('Building the page context for all files')

    const pagesContext = await buildPagesContext(source, pattern)

    return async (req: IncomingMessage, res: ServerResponse) => {
      const result = await processRequest(pagesContext, req)
      res.end(result)
    }
  } catch (error) {
    logger.error(JSON.stringify(error))
  }
}

const processRequest = async (
  pagesContext: any,
  req: IncomingMessage,
): Promise<any> => {
  const normalizedPathname = normalizePathname(req.url)

  if (pageIsApi(normalizedPathname)) {
    const page: Page = getPage(normalizedPathname, pagesContext)
    const response = await page.context.default()

    return response
  }
}

function normalizePathname(pathname) {
  return pathname === '/' || /graphql$/.test(pathname) ? '/index' : pathname
}

function pageIsApi(page) {
  return page.indexOf('/api/') >= 0
}

export default buildHandler
