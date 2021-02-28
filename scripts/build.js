import path from 'path'
import esbuild from 'esbuild'
import module from 'module'
import fs from 'fs'

const { builtinModules } = module
const { startService } = esbuild

const pkg = JSON.parse(await fs.promises.readFile('./package.json', 'utf8'))

const deps = Array.from(
  new Set([
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ]),
)

;(async () => {
  const builder = await startService()
  await builder.build({
    bundle: true,
    external: [...builtinModules, ...deps],
    define: {
      // 'process.env.NODE_ENV': JSON.stringify('production'),
      require: 'requireForCJS',
    },
    entryPoints: [
      path.resolve(process.cwd(), `./src/index.ts`),
      path.resolve(process.cwd(), `./src/builders/api.ts`),
      path.resolve(process.cwd(), `./src/builders/graphql.ts`),
      path.resolve(process.cwd(), `./src/builders/pages.ts`),
      path.resolve(process.cwd(), `./src/cli/index.ts`),
    ],
    format: 'esm',
    logLevel: 'error',
    mainFields: ['module', 'main'],
    outbase: path.resolve(process.cwd(), './src/'),
    outdir: path.resolve(process.cwd(), './dist'),
    platform: 'node',
    sourcemap: process.env.NODE_ENV === 'development',
    splitting: false,
    write: true,
    inject: ['./shims/require-shim.js'],
    minify: true,
  })
  await fs.promises.copyFile('./package.json', './dist/package.json')
  await fs.promises.copyFile('./CHANGELOG.md', './dist/./CHANGELOG.md')
})().catch(err => {
  console.trace(err)
  process.exit(1)
})
