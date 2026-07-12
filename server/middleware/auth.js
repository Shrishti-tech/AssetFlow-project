import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export async function auth(req, res, next) {
  try {
    const token = req.cookies.access_token || req.headers.authorization?.replace(/^Bearer\s+/i, '')
    if (!token) return res.status(401).json({ message: 'Authentication required.' })
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(userId)
    if (!user || user.status !== 'Active') return res.status(401).json({ message: 'Session is no longer valid.' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Your session has expired. Please sign in again.' })
  }
}
