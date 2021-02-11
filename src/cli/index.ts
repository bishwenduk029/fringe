#!/usr/bin/env node

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { cac } from 'cac'
import { handlError } from './errors'
import pino from 'pino'
import esbuild from 'esbuild'

const { startService } = esbuild

async function main() {
  const cli = cac('fringe')
  const service = await startService()

  cli
    .command('build', 'Bundle files', {
      ignoreOptionDefaultValue: true,
    })
    .action(async settings => {
      const { ServerApisBuilder } = await import('../build/builders/api')
      const options: ServerApiBuilderOptions = {
        logger: new pino(),
        service,
        rootDir: process.cwd(),
      }
      const builder: ServerApisBuilder = new ServerApisBuilder(options)
      const apiBuilder = builder.build()
      await apiBuilder
    })

  cli.help()

  const pkgPath = resolve(process.cwd(), './package.json')
  cli.version(JSON.parse(readFileSync(pkgPath, 'utf8')).version)

  cli.parse(process.argv, { run: false })
  await cli.runMatchedCommand()
}

main().catch(handlError)
