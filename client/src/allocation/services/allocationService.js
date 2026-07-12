import api from "../../services/api";

export const getAllocations = async (params = {}) => {
  const response = await api.get("/allocations", { params });
  return response.data;
};

export const getAllocationById = async (id) => {
  const response = await api.get(`/allocations/${id}`);
  return response.data;
};

export const createAllocation = async (payload) => {
  const response = await api.post("/allocations", payload);
  return response.data;
};

export const returnAllocation = async (id, payload = {}) => {
  const response = await api.put(`/allocations/${id}/return`, payload);
  return response.data;
};

export const createTransferRequest = async (payload) => {
  const response = await api.post("/transfers", payload);
  return response.data;
};

export const getAllocationHistory = async (id) => {
  const response = await api.get(`/allocations/${id}/history`);
  return response.data;
};

export const approveTransfer = async (id, payload = {}) => {
  const response = await api.put(`/transfers/${id}/approve`, payload);
  return response.data;
};

export const rejectTransfer = async (id, payload = {}) => {
  const response = await api.put(`/transfers/${id}/reject`, payload);
  return response.data;
};

export default {
  getAllocations,
  getAllocationById,
  createAllocation,
  returnAllocation,
  createTransferRequest,
  getAllocationHistory,
  approveTransfer,
  rejectTransfer,
};
