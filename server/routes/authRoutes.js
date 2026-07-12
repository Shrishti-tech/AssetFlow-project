import { Router } from 'express'
import { currentUser, forgotPassword, login, logout, resetPassword, signup } from '../controllers/authController.js'
import { auth } from '../middleware/auth.js'

export const authRoutes = Router()
authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)
authRoutes.post('/forgot-password', forgotPassword)
authRoutes.post('/reset-password/:token', resetPassword)
authRoutes.get('/me', auth, currentUser)
