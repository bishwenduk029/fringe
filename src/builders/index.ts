import type { Logger } from 'pino'
import { Service } from 'esbuild'
import fs from 'fs'
import Path from 'path'

export interface CommonBuilderOptions {
  logger: Logger
  service: Service
  rootDir: string
}

export abstract class Builder {
  abstract readonly logger: Logger
  abstract readonly service: Service
  abstract readonly rootDir: string
  abstract readonly pageSourcePath: string
  abstract readonly pageBuildPath: string

  public abstract build(): Promise<any>

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
