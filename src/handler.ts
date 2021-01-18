import { RequestHandler } from 'micro'
import { IncomingMessage, ServerResponse } from 'http'
import buildPagesContext from './pages/pagesContext'
import logger from 'logging'

const buildHandler = async (
  source: string,
  pattern: RegExp,
): Promise<RequestHandler> => {
  try {
    logger.info('Building the page context for all files')

    const pagesContext = await buildPagesContext(source, pattern)

    return async (req: IncomingMessage, res: ServerResponse) => {
      res.end(pagesContext[Object.keys(pagesContext)[0]].default())
    }
  } catch (error) {
    logger.error(JSON.stringify(error))
  }
}

export default buildHandler
