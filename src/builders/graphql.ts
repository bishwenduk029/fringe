import { watch } from 'chokidar'
import { Service } from 'esbuild'
import * as Path from 'path'
import type { Logger } from 'pino'
import fs from 'fs'
import module from 'module'
import graphqlLoaderPlugin from './plugins/graphql'
import { CommonBuilderOptions } from '.'

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

export class ServerGraphQLBuilder {
  private readonly delayer: ThrottledDelayer<unknown>
  private readonly logger: Logger
  private readonly service: Service
  private readonly rootDir: string
  private readonly watcher = watch([], {
    ignoreInitial: true,
    usePolling: true,
    interval: 16,
  })
  private readonly watchedFiles = new Set<string>()

  constructor(options: CommonBuilderOptions) {
    this.logger = options.logger
    this.service = options.service
    this.rootDir = options.rootDir
  }

  async build() {
    const start = Date.now()
    const rootDir = this.rootDir
    const graphqlModules = await fs.promises.readdir(
      Path.resolve(rootDir, 'src/graphql/'),
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

    if (!graphqlModules || graphqlModules.length === 0) {
      this.logger.info(
        { latency: Date.now() - start },
        'API graphql build skipped; no graphql entrypoints found.',
      )
    }

    this.logger.info('Starting server graphql build')

    const graphqlBuildPath = `dist`

    await this.service.build({
      bundle: true,
      define: {
        'process.env.NODE_ENV': 'production',
      },
      logLevel: 'error',
      entryPoints: [
        ...graphqlModules.map(graphql =>
          Path.resolve(rootDir, `src/graphql/${graphql}/index.graphql`),
        ),
      ],
      external: [...builtinModules, ...deps],
      format: 'esm',
      incremental: false,
      minify: false,
      outbase: Path.resolve(rootDir),
      outdir: Path.resolve(rootDir, graphqlBuildPath),
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

  async start() {
    await this.delayer.trigger(() => {
      return this.build()
    })
    this.watcher.on('all', () => {
      this.build()
    })
  }
}
