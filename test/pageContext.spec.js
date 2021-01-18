import pagesContext from '../src/pagesContext'
import path from 'path'

it('should be able to normalize all files in nested folder', async () => {
  const output = await pagesContext(path.join(__dirname, './fixtures/pages'))
  expect(output.join()).toBe(
    [
      '/Users/kundb/projects/fringe/test/fixtures/pages/about/test.graphql',
      '/Users/kundb/projects/fringe/test/fixtures/pages/about/test.tsx',
    ].join(),
  )
})
