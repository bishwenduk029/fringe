import http from 'http'
import buildHandler from './handler'
import logger from './logging'
import { Cache } from 'cache'

const FRINGE_PORT = process.env.PORT || 8080
const filePattern: RegExp = new RegExp('/.(js|jsx|ts|tsx|graphql)$/g')

const startApp = async (
  pages: string,
  pattern: RegExp = filePattern,
  cache: Cache,
) => {
  const handler = await buildHandler(pages, pattern, cache)
  const server = http.createServer(handler)

  try {
    server.listen(FRINGE_PORT, () => {
      logger.info(`Server started on port ${FRINGE_PORT}`)
    })
  } catch (error) {
    logger.error(`Server failed to start ${JSON.stringify(error)}`)
  }
}

export default startApp
