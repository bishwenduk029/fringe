import { createRequire } from 'module'
export const requireForCJS = createRequire(import.meta.url)
