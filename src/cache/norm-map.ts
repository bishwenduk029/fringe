import logger from 'logging'
import { Cache } from './index'

export interface NormMap {
  readonly [key: string]: NormObj
}

export type NormKey = string

export type NormFieldValue =
  | NormKey
  | string
  | boolean
  | number
  | null
  | NormFieldValueArray

export interface NormFieldValueArray extends ReadonlyArray<NormFieldValue> {}

export interface NormObj {
  readonly [field: string]: null | NormFieldValue
}

/**
 * An optimized function to merge two maps of normalized objects (as returned from normalize)
 * @param normMap The first normalized map
 * @param newNormMap The second normalized map
 */
export async function merge(
  normMap: Cache,
  newNormMap: NormMap,
): Promise<void> {
  if (normMap) {
    try {
      for (const key of Object.keys(newNormMap)) {
        let updatedNormMap = {}
        const current = await normMap.get(key)
        updatedNormMap = {
          ...(current || {}),
          ...newNormMap[key],
        }
        normMap.put(key, updatedNormMap)
      }
    } catch (error) {
      logger.error(error)
    }
  }
  return
}
