import { api } from '../../auth/services/authService'

export const helpService = {
  getGuides: (search = '') => api.get('/help', { params: search ? { search } : {} }),
  getFaqs: (search = '') => api.get('/faq', { params: search ? { search } : {} }),
  submitTicket: (data) => api.post('/support', data),
}
