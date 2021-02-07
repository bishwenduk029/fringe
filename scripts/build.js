import path from 'path'
import esbuild from 'esbuild'
import module from 'module'

const { builtinModules } = module
const { startService } = esbuild

const externalModules = [...builtinModules, 'pino', 'node-dir']

;(async () => {
  const builder = await startService()
  await builder.build({
    bundle: true,
    external: externalModules,
    define: {
      // 'process.env.NODE_ENV': JSON.stringify('production'),
      require: 'requireForCJS',
    },
    entryPoints: [path.resolve(process.cwd(), `./src/index.ts`)],
    format: 'esm',
    logLevel: 'error',
    mainFields: ['module', 'main'],
    outbase: path.resolve(process.cwd(), './src/'),
    outdir: path.resolve(process.cwd(), './dist'),
    platform: 'node',
    sourcemap: process.env.NODE_ENV === 'development',
    splitting: true,
    write: true,
    inject: ['./shims/require-shim.js'],
  })
})().catch(err => {
  console.trace(err)
  process.exit(1)
})
