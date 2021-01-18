import logger from 'logging'
import dir from 'node-dir'

const buildPagesContext = async (
  directory: string,
  pattern: RegExp,
): Promise<any> => {
  try {
    const files = await dir.promiseFiles(directory)
    return files
      .filter(fileName => !pattern.test(fileName))
      .reduce(async (pagesContext, file) => {
        const context = await import(file)
        return {
          ...pagesContext,
          [file]: context,
        }
      }, {})
  } catch (error) {
    logger.error(error)
  }
  return []
}

export default buildPagesContext
