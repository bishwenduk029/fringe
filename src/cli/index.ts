#!/usr/bin/env node

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { cac } from 'cac'
import { handlError } from './errors'
import pino from 'pino'
import esbuild from 'esbuild'
import { CommonBuilderOptions } from 'builders'

const { startService } = esbuild

async function main() {
  const cli = cac('fringe')
  const service = await startService()

  cli
    .command('build', 'Bundle files', {
      ignoreOptionDefaultValue: true,
    })
    .action(async settings => {
      const { ServerApisBuilder } = await import('../builders/api')

      const { ServerGraphQLBuilder } = await import('../builders/graphql')

      const options: CommonBuilderOptions = {
        logger: new pino(),
        service,
        rootDir: process.cwd(),
      }
      let apiBuilder = new ServerApisBuilder(options).build()
      let graphqlBuilder = new ServerGraphQLBuilder(options).build()

      await Promise.all([apiBuilder, graphqlBuilder])
    })

  cli.help()

  const pkgPath = resolve(process.cwd(), './package.json')
  cli.version(JSON.parse(readFileSync(pkgPath, 'utf8')).version)

  cli.parse(process.argv, { run: false })
  await cli.runMatchedCommand()
}

main().catch(handlError)
