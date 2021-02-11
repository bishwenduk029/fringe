import startApp, { RedisCache } from 'fringe'
import process from 'process'
import path from 'path'

const cache = new RedisCache()

startApp(path.resolve(process.cwd(), './src'), cache)
