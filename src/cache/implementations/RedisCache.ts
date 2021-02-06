import { Cache } from '../index'
import { createNodeRedisClient, WrappedNodeRedisClient } from 'handy-redis'
import { ConnectionString } from 'connection-string'
import logger from 'logging'

class RedisCache implements Cache {
  cache: WrappedNodeRedisClient

  constructor() {
    const redisCredentials = new ConnectionString(
      process.env.REDIS_HOST || process.env.FLY_REDIS_CACHE_URL,
    )
    logger.info(
      `Connecting to Redis instance at ${redisCredentials.hosts[0].name}:${redisCredentials.hosts[0].port}`,
    )
    if (process.env.REDIS_HOST) {
      // When using docker-compose for local development
      this.cache = createNodeRedisClient({})
    } else if (process.env.FLY_REDIS_CACHE_URL) {
      // When hosting on Fly
      this.cache = createNodeRedisClient({
        host: redisCredentials.hosts[0].name,
        port: redisCredentials.hosts[0].port,
        password: redisCredentials.password,
      })
    }
  }

  async get(key: string) {
    const result = await this.cache.get(key)
    return JSON.parse(result)
  }

  async put(key: string, value: any) {
    await this.cache.set(key, JSON.stringify(value))
    return
  }
}
export default RedisCache
