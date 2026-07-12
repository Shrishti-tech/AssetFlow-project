import api from "./api";

export const getNotifications = async (params = {}) => {
  const response = await api.get("/notifications", { params });
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const createBookingReminders = async () => {
  const response = await api.post("/notifications/booking-reminders");
  return response.data;
};

export default {
  getNotifications,
  markNotificationRead,
  createBookingReminders,
};
