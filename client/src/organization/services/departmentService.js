import { api } from '../../auth/services/authService'
export const departmentService = { list: () => api.get('/departments'), create: (data) => api.post('/departments', data), update: (id, data) => api.put(`/departments/${id}`, data), remove: (id) => api.delete(`/departments/${id}`) }
