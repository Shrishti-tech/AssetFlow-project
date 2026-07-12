import api from "./api";

export const getDashboardSummary = async () => {
  const response = await api.get("/reports/dashboard");
  return response.data;
};

export const getAssetUtilization = async (params = {}) => {
  const response = await api.get("/reports/assets", { params });
  return response.data;
};

export const getDepartmentReport = async () => {
  const response = await api.get("/reports/departments");
  return response.data;
};

export const getBookingHeatmap = async (params = {}) => {
  const response = await api.get("/reports/bookings", { params });
  return response.data;
};

export const getMaintenanceReport = async () => {
  const response = await api.get("/reports/maintenance");
  return response.data;
};

export const exportReport = async (report, type, filters = {}) => {
  const response = await api.get("/reports/export", {
    params: { report, type, ...filters },
    responseType: "blob",
  });

  const disposition = response.headers["content-disposition"] || "";
  const match = disposition.match(/filename="?([^"]+)"?/);
  const fileName = match ? match[1] : `${report}-report.${type}`;

  const url = window.URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default {
  getDashboardSummary,
  getAssetUtilization,
  getDepartmentReport,
  getBookingHeatmap,
  getMaintenanceReport,
  exportReport,
};
