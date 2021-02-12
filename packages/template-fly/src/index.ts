import startApp, { RedisCache } from '@bishwenduk029/fringe'
import process from 'process'
import path from 'path'

const cache = new RedisCache()

startApp(path.resolve(process.cwd(), './dist/src'), cache)
