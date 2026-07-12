import { api } from '../../auth/services/authService'

export const getAllocations = async (params = {}) => (await api.get('/allocations', { params })).data
export const getAllocationById = async (id) => (await api.get(`/allocations/${id}`)).data
export const getAllocationOptions = async () => (await api.get('/allocations/options')).data
export const createAllocation = async (payload) => (await api.post('/allocations', payload)).data
export const returnAllocation = async (id, payload) => (await api.put(`/allocations/${id}/return`, payload)).data
export const createTransferRequest = async (payload) => (await api.post('/allocations/transfers', payload)).data
export const getTransfers = async () => (await api.get('/allocations/transfers')).data
export const getAllocationHistory = async (id) => (await api.get('/allocations/history', { params: id ? { allocation: id } : {} })).data
export const approveTransfer = async (id) => (await api.put(`/allocations/transfers/${id}/approve`)).data
export const rejectTransfer = async (id) => (await api.put(`/allocations/transfers/${id}/reject`)).data
