import { watch } from 'chokidar'
import { Service } from 'esbuild'
import * as Path from 'path'
import type { Logger } from 'pino'
import fs from 'fs'
import module from 'module'
import { CommonBuilderOptions } from '.'
import { ThrottledDelayer } from 'ts-primitives'

const { builtinModules } = module

export interface ServerApiBuildResult {
  apiNames: string[]
  serverApiEntry: string | null
}

export class ServerApisBuilder {
  private readonly delayer: ThrottledDelayer<unknown>
  private readonly logger: Logger
  private readonly service: Service
  private readonly rootDir: string
  private readonly watcher = watch([], {
    ignoreInitial: true,
    usePolling: true,
    interval: 16,
  })

  constructor(options: CommonBuilderOptions) {
    this.logger = options.logger
    this.service = options.service
    this.rootDir = options.rootDir
  }

  async build() {
    const start = Date.now()
    const rootDir = this.rootDir
    const apiModules = await fs.promises.readdir(
      Path.resolve(rootDir, 'src/api/'),
      'utf-8',
    )
    const pkg = JSON.parse(
      await fs.promises.readFile(Path.resolve(rootDir, 'package.json'), 'utf8'),
    )

    const deps = Array.from(
      new Set([
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ]),
    )

    if (!apiModules || apiModules.length === 0) {
      this.logger.info(
        { latency: Date.now() - start },
        'API functions build skipped; no api entrypoints found.',
      )
    }

    this.logger.info('Starting server api build')

    const apiBuildPath = `dist`

    await this.service.build({
      bundle: true,
      define: {
        'process.env.NODE_ENV': 'production',
      },
      logLevel: 'error',
      entryPoints: [
        Path.resolve(rootDir, 'src/index.ts'),
        ...apiModules.map(api =>
          Path.resolve(rootDir, `src/api/${api}/index.ts`),
        ),
      ],
      external: [...builtinModules, ...deps],
      format: 'esm',
      incremental: false,
      minify: false,
      outbase: Path.resolve(rootDir),
      outdir: Path.resolve(rootDir, apiBuildPath),
      platform: 'node',
      plugins: [],
      resolveExtensions: ['.ts', '.js'],
      sourcemap: false,
      splitting: false,
      treeShaking: true,
      write: true,
    })

    this.logger.info(
      { latency: Date.now() - start },
      'Finished server functions build',
    )
  }

  async start() {
    await this.delayer.trigger(() => {
      return this.build()
    })
    this.watcher.on('all', () => {
      this.build()
    })
  }
}
