import { parse, print, visit } from 'graphql'

const FRINGE_CACHE = 'fringe_cache'

export function extractCacheKeyFields(query) {
  const ast = parse(query)
  let cacheFields = []
  let visitor = {
    Field(node) {
      if (node.directives.length) {
        cacheFields = node.directives.reduce((cacheFields, directive) => {
          if (directive.name.value === FRINGE_CACHE)
            return [...cacheFields, node.name.value]
        }, cacheFields)
        return {
          ...node,
          directives: node.directives.filter(
            directive => directive.name.value !== FRINGE_CACHE,
          ),
        }
      }
    },
  }
  const updatedQuery = print(visit(ast, visitor))
  return { updatedQuery, cacheFields }
}

const gql = `query {
    launchesPast(limit: 2) {
      mission_name @fringe_cache
      launch_date_local @fringe_cache
      launch_site {
        site_name_long
      }
    }
  }`

const expectedGQL = `{
    launchesPast(limit: 2) {
      mission_name
      launch_date_local
      launch_site {
        site_name_long
      }
    }
  }`

it('should be able to normalize all files in nested folder', async () => {
  const output = await pagesContext(path.join(__dirname, './fixtures/pages'))
  expect(output.join()).toBe(
    [
      '/Users/kundb/projects/fringe/test/fixtures/pages/about/test.graphql',
      '/Users/kundb/projects/fringe/test/fixtures/pages/about/test.tsx',
    ].join(),
  )
})

it.only('should be able to extract cache fields', () => {
  const { updatedQuery, cacheFields } = extractCacheKeyFields(gql)
  expect(cacheFields).toEqual(['mission_name', 'launch_date_local'])
})
