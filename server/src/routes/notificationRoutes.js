import express from "express";
import { notificationController, activityController, reminderController } from "../controllers/notificationController.js";
import { requireActivityAccess, validateReminderPayload, validateReminderUpdate } from "../middleware/notificationMiddleware.js";
import { auth } from "../../middleware/auth.js";

export const notificationRoutes = express.Router();
notificationRoutes.use(auth);
notificationRoutes.get("/", notificationController.list);
notificationRoutes.put("/read-all", notificationController.markAllRead);
notificationRoutes.get("/:id", notificationController.getById);
notificationRoutes.put("/:id/read", notificationController.markRead);
notificationRoutes.delete("/:id", notificationController.remove);

export const activityRoutes = express.Router();
activityRoutes.use(auth);
activityRoutes.get("/", requireActivityAccess, activityController.list);

export const reminderRoutes = express.Router();
reminderRoutes.use(auth);
reminderRoutes.get("/", reminderController.list);
reminderRoutes.post("/", validateReminderPayload, reminderController.create);
reminderRoutes.put("/:id", validateReminderUpdate, reminderController.update);
reminderRoutes.delete("/:id", reminderController.remove);

export default notificationRoutes;
