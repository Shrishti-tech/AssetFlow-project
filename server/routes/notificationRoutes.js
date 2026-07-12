import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { listNotifications, markRead } from '../controllers/notificationController.js'

export const notificationRoutes = Router()
notificationRoutes.use(auth)
notificationRoutes.get('/', listNotifications)
notificationRoutes.put('/:id/read', markRead)
