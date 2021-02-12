import type { Logger } from 'pino'
import { Service } from 'esbuild'

export interface CommonBuilderOptions {
  logger: Logger
  service: Service
  rootDir: string
}
