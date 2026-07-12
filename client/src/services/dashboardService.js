import api from "./api";

export const getDashboardSummary = async () => {
  const response = await api.get("/allocations/dashboard/summary");
  return response.data;
};

export default {
  getDashboardSummary,
};
