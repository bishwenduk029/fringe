import { Service } from 'esbuild'
import * as Path from 'path'
import type { Logger } from 'pino'
import module from 'module'
import { Builder, CommonBuilderOptions } from '.'

const { builtinModules } = module

export interface ServerApiBuildResult {
  apiNames: string[]
  serverApiEntry: string | null
}

export class ServerApisBuilder extends Builder {
  readonly logger: Logger
  readonly service: Service
  readonly rootDir: string
  readonly pageSourcePath: string = 'src/api'
  readonly pageBuildPath: string = 'dist'

  constructor(options: CommonBuilderOptions) {
    super()
    this.logger = options.logger
    this.service = options.service
    this.rootDir = options.rootDir
  }

  public async build() {
    const start = Date.now()
    const { modulePaths, deps } = await this.setup()
    const apiModules = modulePaths

    if (!apiModules || apiModules.length === 0) {
      this.logger.info(
        { latency: Date.now() - start },
        'API functions build skipped; no api entrypoints found.',
      )
      return
    }

    this.logger.info('Starting server api build')

    await this.service.build({
      bundle: true,
      define: {
        'process.env.NODE_ENV': 'production',
      },
      logLevel: 'error',
      entryPoints: [
        Path.resolve(this.rootDir, 'src/index.ts'),
        ...apiModules.map(api =>
          Path.resolve(this.rootDir, `${this.pageSourcePath}/${api}/index.ts`),
        ),
      ],
      external: [...builtinModules, ...deps],
      format: 'esm',
      incremental: false,
      minify: false,
      outbase: Path.resolve(this.rootDir),
      outdir: Path.resolve(this.rootDir, this.pageBuildPath),
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
}
