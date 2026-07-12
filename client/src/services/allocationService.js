import api from './api'

export const allocationService = {
  list: () => api.get('/allocations'),
  create: (data) => api.post('/allocations', data),
  returnAsset: (id, data = {}) => api.put(`/allocations/${id}/return`, data),
  requestTransfer: (data) => api.post('/allocations/transfers', data),
  approveTransfer: (id, data = {}) => api.put(`/allocations/transfers/${id}/approve`, data),
  rejectTransfer: (id, data = {}) => api.put(`/allocations/transfers/${id}/reject`, data),
}
