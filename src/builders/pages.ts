import { Service } from 'esbuild'
import * as Path from 'path'
import type { Logger } from 'pino'
import { Builder, CommonBuilderOptions } from '.'
import module from 'module'

const { builtinModules } = module

export interface ServerPagesBuildResult {
  pageNames: string[]
  serverApiEntry: string | null
}

export interface ServerPagesBuilderOptions {
  logger: Logger
  service: Service
  rootDir: string
}

export class ServerPagesBuilder extends Builder {
  readonly logger: Logger
  readonly service: Service
  readonly rootDir: string
  readonly pageSourcePath: string = 'src/pages'
  readonly pageBuildPath: string = 'dist'

  constructor(options: CommonBuilderOptions) {
    super()
    this.logger = options.logger
    this.service = options.service
    this.rootDir = options.rootDir
  }

  public async build() {
    const start = Date.now()
    const rootDir = this.rootDir
    const { modulePaths, deps } = await this.setup()
    const pageModules = modulePaths

    if (!pageModules || pageModules.length === 0) {
      this.logger.info(
        { latency: Date.now() - start },
        'Page build skipped; no page entry points found.',
      )
      return
    }

    this.logger.info('Starting server page build')

    await this.service.build({
      bundle: true,
      define: {
        'process.env.NODE_ENV': 'production',
      },
      logLevel: 'error',
      entryPoints: [
        ...pageModules.map(page =>
          Path.resolve(rootDir, `${this.pageSourcePath}/${page}/index.tsx`),
        ),
      ],
      external: [...builtinModules, ...deps],
      format: 'esm',
      incremental: false,
      minify: false,
      outbase: Path.resolve(rootDir),
      outdir: Path.resolve(rootDir, this.pageBuildPath),
      platform: 'node',
      resolveExtensions: ['.tsx', '.jsx'],
      sourcemap: false,
      splitting: false,
      treeShaking: true,
      write: true,
    })

    this.logger.info(
      { latency: Date.now() - start },
      'Finished server pages build',
    )
  }
}
