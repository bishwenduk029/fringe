import logger from '../logging'
import fs from 'fs'

export const DYNAMIC_PAGE = new RegExp('\\[(\\w+)\\]', 'g')

export interface Page {
  page: string
  pagePath: string
  context?: any
  test: RegExp
}

export function resolvePagePath(pagePath: string, keys: string[]): Page {
  const pagesMap: Page[] = keys.map(page => {
    let test = page
    let parts = []

    test = test
      .replace('/', '\\/')
      .replace(/^\./, '')
      .replace(/\.(js|jsx|ts|tsx|graphql)$/, '')

    return {
      page,
      pagePath: page
        .replace(/^\./, '')
        .replace(/\.(js|jsx|ts|tsx|graphql)$/, ''),
      parts,
      test: new RegExp('^' + test + '$', ''),
    }
  })

  /**
   * First, try to find an exact match.
   */
  let page = pagesMap.find(p => p.pagePath.indexOf(pagePath) >= 0)

  if (!page) {
    /**
     * Sort pages to include those with `index` in the name first, because
     * we need those to get matched more greedily than their dynamic counterparts.
     */
    pagesMap.sort(a => (a.page.includes('index') ? -1 : 1))

    page = pagesMap.find(p => p.test.test(pagePath))
  }

  /**
   * If an exact match couldn't be found, try giving it another shot with /index at
   * the end. This helps discover dynamic nested index pages.
   */
  if (!page) {
    page = pagesMap.find(p => p.test.test(pagePath + '/index'))
  }

  if (!page) return null

  return page
}

export async function getPage(
  pagePath: string,
  context: string[],
  isGraphQL: boolean = false,
): Promise<Page> {
  try {
    const resolvedPage = resolvePagePath(pagePath, context)
    if (!resolvedPage) {
      return null
    }

    if (isGraphQL) {
      const query = await fs.promises.readFile(resolvedPage.page, 'utf-8')
      return {
        ...resolvedPage,
        context: query,
      }
    }

    const pageContext = await import(resolvedPage.page)

    return {
      ...resolvedPage,
      context: pageContext,
    }
  } catch (e) {
    logger.error(e)
  }
}
