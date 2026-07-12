import { api } from '../../auth/services/authService'
export const employeeService = { list: () => api.get('/employees?limit=100'), create: (data) => api.post('/employees', data), update: (id, data) => api.put(`/employees/${id}`, data), remove: (id) => api.delete(`/employees/${id}`) }
