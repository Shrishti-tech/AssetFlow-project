import express from "express";
import reportsController from "../controllers/reportsController.js";
import { validateDateRange, validateExportRequest } from "../middleware/reportsMiddleware.js";
import { auth } from "../../middleware/auth.js";

export const reportsRoutes = express.Router();
reportsRoutes.use(auth);

reportsRoutes.get("/dashboard", reportsController.dashboard);
reportsRoutes.get("/assets", validateDateRange, reportsController.assetUtilization);
reportsRoutes.get("/departments", reportsController.departments);
reportsRoutes.get("/bookings", validateDateRange, reportsController.bookingHeatmap);
reportsRoutes.get("/maintenance", reportsController.maintenance);
reportsRoutes.get("/export", validateExportRequest, reportsController.exportReport);

export default reportsRoutes;
