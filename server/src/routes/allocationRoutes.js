import express from "express";
import allocationController from "../controllers/allocationController.js";
import {
  requireAllocationAccess,
  validateAllocationPayload,
} from "../middleware/allocationMiddleware.js";

export const allocationRoutes = express.Router();

allocationRoutes.post(
  "/",
  validateAllocationPayload,
  allocationController.create,
);
allocationRoutes.get("/", requireAllocationAccess, allocationController.list);
allocationRoutes.get(
  "/:id",
  requireAllocationAccess,
  allocationController.getById,
);
allocationRoutes.put(
  "/:id/return",
  validateAllocationPayload,
  allocationController.returnAllocation,
);
allocationRoutes.put(
  "/:id",
  validateAllocationPayload,
  allocationController.update,
);
allocationRoutes.delete(
  "/:id",
  requireAllocationAccess,
  allocationController.remove,
);
allocationRoutes.post(
  "/transfers",
  validateAllocationPayload,
  allocationController.requestTransfer,
);
allocationRoutes.put(
  "/transfers/:id/approve",
  validateAllocationPayload,
  allocationController.approveTransfer,
);
allocationRoutes.put(
  "/transfers/:id/reject",
  validateAllocationPayload,
  allocationController.rejectTransfer,
);
allocationRoutes.get(
  "/:id/history",
  requireAllocationAccess,
  allocationController.history,
);

export default allocationRoutes;
