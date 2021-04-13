import startApp, { RedisCache } from '@bishwenduk029/fringe'
import path from 'path'

const cache = new RedisCache()

startApp(path.resolve(process.cwd(), './src'), cache)
