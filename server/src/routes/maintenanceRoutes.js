import express from "express";
import maintenanceController from "../controllers/maintenanceController.js";
import {
  validateMaintenanceRequest,
  validateTechnicianAssignment,
  requireAssetManager,
} from "../middleware/maintenanceMiddleware.js";
import { auth } from "../../middleware/auth.js";

export const maintenanceRoutes = express.Router();
maintenanceRoutes.use(auth);

maintenanceRoutes.get("/technicians", maintenanceController.technicians);

maintenanceRoutes.post("/", validateMaintenanceRequest, maintenanceController.create);
maintenanceRoutes.get("/", maintenanceController.list);
maintenanceRoutes.get("/:id", maintenanceController.getById);
maintenanceRoutes.get("/:id/history", maintenanceController.history);

maintenanceRoutes.put("/:id/approve", requireAssetManager, maintenanceController.approve);
maintenanceRoutes.put("/:id/reject", requireAssetManager, maintenanceController.reject);
maintenanceRoutes.put(
  "/:id/assign",
  requireAssetManager,
  validateTechnicianAssignment,
  maintenanceController.assign,
);
maintenanceRoutes.put("/:id/start", requireAssetManager, maintenanceController.start);
maintenanceRoutes.put("/:id/complete", requireAssetManager, maintenanceController.complete);

export default maintenanceRoutes;
