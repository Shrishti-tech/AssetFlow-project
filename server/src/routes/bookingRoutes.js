import express from "express";
import bookingController from "../controllers/bookingController.js";
import {
  requireBookingAccess,
  validateBookingPayload,
} from "../middleware/bookingMiddleware.js";

export const bookingRoutes = express.Router();

bookingRoutes.post("/", validateBookingPayload, bookingController.create);
bookingRoutes.get("/", requireBookingAccess, bookingController.list);
bookingRoutes.get(
  "/calendar",
  requireBookingAccess,
  bookingController.calendar,
);
bookingRoutes.get(
  "/:id/history",
  requireBookingAccess,
  bookingController.history,
);
bookingRoutes.get("/:id", requireBookingAccess, bookingController.getById);
bookingRoutes.put("/:id", validateBookingPayload, bookingController.update);
bookingRoutes.put(
  "/:id/cancel",
  requireBookingAccess,
  bookingController.cancel,
);
bookingRoutes.delete("/:id", requireBookingAccess, bookingController.remove);

export default bookingRoutes;
