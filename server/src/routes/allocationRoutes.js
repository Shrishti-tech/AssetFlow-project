import express from "express";
import allocationController from "../controllers/allocationController.js";
import {
  requireAllocationAccess,
  validateAllocationPayload,
} from "../middleware/allocationMiddleware.js";

export const allocationRoutes = express.Router();

allocationRoutes.get("/", requireAllocationAccess, allocationController.list);
allocationRoutes.get(
  "/:id",
  requireAllocationAccess,
  allocationController.getById,
);
allocationRoutes.post(
  "/",
  validateAllocationPayload,
  allocationController.create,
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
  "/transfer",
  validateAllocationPayload,
  allocationController.requestTransfer,
);
allocationRoutes.get(
  "/:id/history",
  requireAllocationAccess,
  allocationController.history,
);

export default allocationRoutes;
