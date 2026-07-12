import api from "./api";

export const getAssets = async (params = {}) => {
  const response = await api.get("/assets", { params });
  return response.data;
};

export const getAssetById = async (id) => {
  const response = await api.get(`/assets/${id}`);
  return response.data;
};

export const createAsset = async (payload) => {
  const response = await api.post("/assets", payload);
  return response.data;
};

export const updateAsset = async (id, payload) => {
  const response = await api.put(`/assets/${id}`, payload);
  return response.data;
};

export const deleteAsset = async (id) => {
  const response = await api.delete(`/assets/${id}`);
  return response.data;
};

export default {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
};
