import type { Logger } from 'pino'
import { watch } from 'chokidar'
import { Service } from 'esbuild'
import fs from 'fs'
import Path from 'path'
import { ThrottledDelayer } from 'ts-primitives'

export interface CommonBuilderOptions {
  logger: Logger
  service: Service
  rootDir: string
}

export abstract class Builder {
  private readonly delayer: ThrottledDelayer<unknown>
  abstract readonly logger: Logger
  abstract readonly service: Service
  abstract readonly rootDir: string
  abstract readonly pageSourcePath: string
  abstract readonly pageBuildPath: string
  private readonly watcher = watch([], {
    ignoreInitial: true,
    usePolling: true,
    interval: 16,
  })

  public abstract build(): Promise<Void>

  private async start() {
    await this.delayer.trigger(() => {
      return this.build()
    })
    this.watcher.on('all', () => {
      this.build()
    })
  }

  async setup() {
    const modulePaths = await fs.promises.readdir(
      Path.resolve(this.rootDir, this.pageSourcePath),
      'utf-8',
    )
    const pkg = JSON.parse(
      await fs.promises.readFile(
        Path.resolve(this.rootDir, 'package.json'),
        'utf8',
      ),
    )

    const deps = Array.from(
      new Set([
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ]),
    )
    return {
      modulePaths,
      pkg,
      deps,
    }
  }
}
