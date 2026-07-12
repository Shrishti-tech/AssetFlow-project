import api from "./api";

export const getMaintenanceRequests = async (params = {}) => {
  const response = await api.get("/maintenance", { params });
  return response.data;
};

export const getMaintenanceById = async (id) => {
  const response = await api.get(`/maintenance/${id}`);
  return response.data;
};

export const createMaintenanceRequest = async (payload) => {
  const response = await api.post("/maintenance", payload);
  return response.data;
};

export const approveMaintenance = async (id, payload = {}) => {
  const response = await api.put(`/maintenance/${id}/approve`, payload);
  return response.data;
};

export const rejectMaintenance = async (id, payload = {}) => {
  const response = await api.put(`/maintenance/${id}/reject`, payload);
  return response.data;
};

export const assignTechnician = async (id, payload) => {
  const response = await api.put(`/maintenance/${id}/assign`, payload);
  return response.data;
};

export const startRepair = async (id, payload = {}) => {
  const response = await api.put(`/maintenance/${id}/start`, payload);
  return response.data;
};

export const completeRepair = async (id, payload = {}) => {
  const response = await api.put(`/maintenance/${id}/complete`, payload);
  return response.data;
};

export const getMaintenanceHistory = async (id) => {
  const response = await api.get(`/maintenance/${id}/history`);
  return response.data;
};

export const getAvailableTechnicians = async () => {
  const response = await api.get("/maintenance/technicians");
  return response.data;
};

export default {
  getMaintenanceRequests,
  getMaintenanceById,
  createMaintenanceRequest,
  approveMaintenance,
  rejectMaintenance,
  assignTechnician,
  startRepair,
  completeRepair,
  getMaintenanceHistory,
  getAvailableTechnicians,
};
