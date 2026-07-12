import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { authRoutes } from './routes/authRoutes.js'

export const app = express()
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Something went wrong. Please try again.' })
})
