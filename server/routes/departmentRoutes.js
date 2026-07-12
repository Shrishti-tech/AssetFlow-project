import { Router } from 'express'
import { createDepartment, deleteDepartment, getDepartment, listDepartments, updateDepartment } from '../controllers/departmentController.js'
import { auth } from '../middleware/auth.js'
import { adminMiddleware } from '../middleware/adminMiddleware.js'

export const departmentRoutes = Router()
departmentRoutes.use(auth, adminMiddleware)
departmentRoutes.route('/').get(listDepartments).post(createDepartment)
departmentRoutes.route('/:id').get(getDepartment).put(updateDepartment).delete(deleteDepartment)
