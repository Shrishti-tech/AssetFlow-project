import { Router } from 'express'
import { createCategory, deleteCategory, getCategory, listCategories, updateCategory } from '../controllers/categoryController.js'
import { auth } from '../middleware/auth.js'
import { adminMiddleware } from '../middleware/adminMiddleware.js'

export const categoryRoutes = Router()
categoryRoutes.use(auth, adminMiddleware)
categoryRoutes.route('/').get(listCategories).post(createCategory)
categoryRoutes.route('/:id').get(getCategory).put(updateCategory).delete(deleteCategory)
