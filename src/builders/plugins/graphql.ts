import fs from 'fs'
import { parse, visit, DocumentNode } from 'graphql'
import { Plugin } from 'esbuild'

const FRINGE_CACHE = 'fringe_cache'

const generateDocumentNodeAndCacheFields = (graphqlString: string) => {
  const { updatedAST, cacheFields } = extractCacheKeyFields(graphqlString)

  return { updatedAST, cacheFields }
}

export function extractCacheKeyFields(graphqlString: string) {
  let cacheFields = []
  const ast = parse(graphqlString)
  let visitor = {
    Field(node) {
      if (node.directives.length) {
        cacheFields = node.directives.reduce(
          (cacheFields: string[], directive: any) => {
            if (directive.name.value === FRINGE_CACHE)
              return [...cacheFields, node.name.value]
          },
          cacheFields,
        )
        return {
          ...node,
          directives: node.directives.filter(
            directive => directive.name.value !== FRINGE_CACHE,
          ),
        }
      }
    },
  }
  const updatedAST: DocumentNode = visit(ast, visitor)
  return { updatedAST, cacheFields }
}

const graphqlLoaderPlugin = (): Plugin => ({
  name: 'graphql-loader',
  setup(build) {
    build.onLoad({ filter: /\.graphql$/ }, async args => {
      let graphqlString = await fs.promises.readFile(args.path, 'utf8')
      const { updatedAST, cacheFields } = generateDocumentNodeAndCacheFields(
        graphqlString,
      )
      return {
        contents: `export const updatedAST=${JSON.stringify(
          updatedAST,
        )}; export const cacheFields=${cacheFields}`,
      }
    })
  },
})

export default graphqlLoaderPlugin
