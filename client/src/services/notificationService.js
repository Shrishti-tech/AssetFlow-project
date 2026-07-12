import api from "./api";

export const getNotifications = async (params = {}) => {
  const response = await api.get("/notifications", { params });
  return response.data;
};

export const getNotification = async (id) => {
  const response = await api.get(`/notifications/${id}`);
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.put("/notifications/read-all");
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

export const getActivityLogs = async (params = {}) => {
  const response = await api.get("/activity", { params });
  return response.data;
};

export const getReminders = async (params = {}) => {
  const response = await api.get("/reminders", { params });
  return response.data;
};

export const createReminder = async (payload) => {
  const response = await api.post("/reminders", payload);
  return response.data;
};

export const updateReminder = async (id, payload) => {
  const response = await api.put(`/reminders/${id}`, payload);
  return response.data;
};

export const deleteReminder = async (id) => {
  const response = await api.delete(`/reminders/${id}`);
  return response.data;
};

export default {
  getNotifications,
  getNotification,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getActivityLogs,
  getReminders,
  createReminder,
  updateReminder,
  deleteReminder,
};
