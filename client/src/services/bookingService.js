import api from "./api";

export const getBookings = async (params = {}) => {
  const response = await api.get("/bookings", { params });
  return response.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

export const createBooking = async (payload) => {
  const response = await api.post("/bookings", payload);
  return response.data;
};

export const updateBooking = async (id, payload) => {
  const response = await api.put(`/bookings/${id}`, payload);
  return response.data;
};

export const cancelBooking = async (id, payload = {}) => {
  const response = await api.put(`/bookings/${id}/cancel`, payload);
  return response.data;
};

export const getBookingCalendar = async (params = {}) => {
  const response = await api.get("/bookings/calendar", { params });
  return response.data;
};

export default {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  cancelBooking,
  getBookingCalendar,
};
