import startApp from 'fringe'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

startApp(path.join(__dirname, './pages'))
