import { Router } from "express";
import { auth } from "../middleware/auth.js";
import {
  createBookingReminders,
  listNotifications,
  markRead,
} from "../controllers/notificationController.js";

export const notificationRoutes = Router();

notificationRoutes.use(auth);
notificationRoutes.get("/", listNotifications);
notificationRoutes.post("/booking-reminders", createBookingReminders);
notificationRoutes.put("/:id/read", markRead);
