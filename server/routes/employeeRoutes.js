import { Router } from 'express'
import { createEmployee, deleteEmployee, getEmployee, listEmployees, updateEmployee } from '../controllers/employeeController.js'
import { auth } from '../middleware/auth.js'
import { adminMiddleware } from '../middleware/adminMiddleware.js'

export const employeeRoutes = Router()
employeeRoutes.use(auth, adminMiddleware)
employeeRoutes.route('/').get(listEmployees).post(createEmployee)
employeeRoutes.route('/:id').get(getEmployee).put(updateEmployee).delete(deleteEmployee)
