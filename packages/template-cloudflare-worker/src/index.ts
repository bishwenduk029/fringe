import {buildCloudflareWorkerHandler} from '@bishwenduk029/fringe'
import path from 'path'

addEventListener('fetch', event => {
  let cache = caches.default
  const handleRequest = await buildCloudflareWorkerHandler(path.resolve(process.cwd(), './src'), cache)
  event.respondWith(handleRequest(event.request))
})
