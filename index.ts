import micro from 'micro'
import buildHandler from './src/handler'
import logger from './src/logging'

const FRINGE_PORT = process.env.PORT || 8080
const filePattern: RegExp = new RegExp('/.(js|jsx|ts|tsx)$/g')

const startApp = async (pages: string, pattern: RegExp = filePattern) => {
  const handler = await buildHandler(pages, pattern)
  const server = micro(handler)
  server.listen(FRINGE_PORT).on('listening', () => {
    logger.info(`Server started on port ${FRINGE_PORT}`)
  })
}

//startApp('./test/fixtures/pages')

export default startApp
