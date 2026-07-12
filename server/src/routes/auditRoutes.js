import express from "express";
import auditController from "../controllers/auditController.js";
import {
  requireAdmin,
  requireAuditManager,
  validateAuditCyclePayload,
  validateAssignmentPayload,
  validateVerificationPayload,
} from "../middleware/auditMiddleware.js";
import { auth } from "../../middleware/auth.js";

export const auditRoutes = express.Router();
auditRoutes.use(auth);

auditRoutes.post("/", requireAdmin, validateAuditCyclePayload, auditController.create);
auditRoutes.get("/", auditController.list);
auditRoutes.get("/:id", auditController.getById);
auditRoutes.post("/:id/assign", requireAuditManager, validateAssignmentPayload, auditController.assign);
auditRoutes.put("/:id/verify", validateVerificationPayload, auditController.verify);
auditRoutes.put("/:id/close", requireAuditManager, auditController.close);
auditRoutes.get("/:id/report", auditController.report);

export default auditRoutes;
