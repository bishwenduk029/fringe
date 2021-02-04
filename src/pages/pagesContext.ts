import logger from '../logging'
import dir from 'node-dir'

const buildPagesContext = async (
  directory: string,
  pattern: RegExp,
): Promise<any> => {
  try {
    const files = await dir.promiseFiles(directory)
    return files.filter(fileName => !pattern.test(fileName))
  } catch (error) {
    logger.error(error)
  }
  return []
}

export default buildPagesContext
