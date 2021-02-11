import startApp from '../../../dist/index'
import process from 'process'
import path from 'path'

startApp(path.resolve(process.cwd(), './pages'))
