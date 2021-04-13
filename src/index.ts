import http from 'http'
import buildHandler from './handler'
import logger from './logging'
import { Cache, RedisCache } from 'cache'
import { buildCloudflareWorkerHandler } from './handler'

const FRINGE_PORT = process.env.PORT || 8080
const filePattern: RegExp = new RegExp('/.(js|jsx|ts|tsx|graphql)$/g')

const startApp = async (
  pages: string,
  cache: Cache,
  pattern: RegExp = filePattern,
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

export { RedisCache, buildCloudflareWorkerHandler }

export default startApp
