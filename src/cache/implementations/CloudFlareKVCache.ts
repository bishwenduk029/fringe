import { Cache } from '../index'

class CloudFlareKV implements Cache {
  namespace: any
  constructor(kvNameSpace: any) {
    this.namespace = kvNameSpace
  }

  async get(key: string) {
    const result = await this.namespace.get(key)
    return JSON.parse(result)
  }

  async put(key: string, value: any) {
    await this.namespace.put(key, JSON.stringify(value))
    return ''
  }
}

export default CloudFlareKV
