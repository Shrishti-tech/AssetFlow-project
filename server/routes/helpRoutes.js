import { Router } from 'express'
import { createSupportTicket, listFaqs, listGuides } from '../controllers/helpController.js'
import { auth } from '../middleware/auth.js'

export const helpRoutes = Router()
helpRoutes.get('/', auth, listGuides)

export const faqRoutes = Router()
faqRoutes.get('/', auth, listFaqs)

export const supportRoutes = Router()
supportRoutes.post('/', auth, createSupportTicket)
