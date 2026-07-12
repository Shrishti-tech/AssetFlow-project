import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { app } from './app.js'
import { connectDatabase } from './config/db.js'

const serverDirectory = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(serverDirectory, '.env') })

const port = process.env.PORT || 5000
connectDatabase().then(() => app.listen(port, () => console.log(`AssetFlow API listening on ${port}`))).catch((error) => {
  console.error('Database connection failed:', error.message)
  process.exit(1)
})
