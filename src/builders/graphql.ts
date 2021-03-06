import { Service } from 'esbuild'
import * as Path from 'path'
import type { Logger } from 'pino'
import module from 'module'
import graphqlLoaderPlugin from './plugins/graphql'
import { Builder, CommonBuilderOptions } from '.'

const { builtinModules } = module

export interface SereverGraphQLBuildResult {
  graphqlNames: string[]
  serverApiEntry: string | null
}

export interface SereverGraphQLBuilderOptions {
  logger: Logger
  service: Service
  rootDir: string
}

export class ServerGraphQLBuilder extends Builder {
  readonly logger: Logger
  readonly service: Service
  readonly rootDir: string
  readonly pageSourcePath: string = 'src/graphql'
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
    const graphqlModules = modulePaths

    if (!graphqlModules || graphqlModules.length === 0) {
      this.logger.info(
        { latency: Date.now() - start },
        'Graphql build skipped; no graphql entrypoints found.',
      )
      return
    }

    this.logger.info('Starting server graphql build')

    await this.service.build({
      bundle: true,
      define: {
        'process.env.NODE_ENV': 'production',
      },
      logLevel: 'error',
      entryPoints: [
        ...graphqlModules.map(graphql =>
          Path.resolve(
            rootDir,
            `${this.pageSourcePath}/${graphql}/index.graphql`,
          ),
        ),
      ],
      external: [...builtinModules, ...deps],
      format: 'esm',
      incremental: false,
      minify: false,
      outbase: Path.resolve(rootDir),
      outdir: Path.resolve(rootDir, this.pageBuildPath),
      platform: 'node',
      resolveExtensions: ['.graphql', '.ts', '.js'],
      plugins: [graphqlLoaderPlugin()],
      outExtension: { '.js': '.js' },
      sourcemap: false,
      splitting: false,
      treeShaking: true,
      write: true,
    })

    this.logger.info(
      { latency: Date.now() - start },
      'Finished server graphql build',
    )
  }
}
