import api from "./api";

export const createAuditCycle = async (payload) => {
  const response = await api.post("/audits", payload);
  return response.data;
};

export const getAuditCycles = async (params = {}) => {
  const response = await api.get("/audits", { params });
  return response.data;
};

export const getAuditCycleDetails = async (id) => {
  const response = await api.get(`/audits/${id}`);
  return response.data;
};

export const assignAuditor = async (id, payload) => {
  const response = await api.post(`/audits/${id}/assign`, payload);
  return response.data;
};

export const verifyAsset = async (id, payload) => {
  const response = await api.put(`/audits/${id}/verify`, payload);
  return response.data;
};

export const closeAudit = async (id) => {
  const response = await api.put(`/audits/${id}/close`);
  return response.data;
};

export const getDiscrepancyReport = async (id, params = {}) => {
  const response = await api.get(`/audits/${id}/report`, { params });
  return response.data;
};

export default {
  createAuditCycle,
  getAuditCycles,
  getAuditCycleDetails,
  assignAuditor,
  verifyAsset,
  closeAudit,
  getDiscrepancyReport,
};
