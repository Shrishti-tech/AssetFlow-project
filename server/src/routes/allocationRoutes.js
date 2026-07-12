import express from "express";
import allocationController from "../controllers/allocationController.js";
import {
  requireAllocationAccess,
  validateAllocationPayload,
  validateReturnPayload,
  validateTransferPayload,
} from "../middleware/allocationMiddleware.js";
import { auth } from '../../middleware/auth.js'
import { authorize } from '../../middleware/roleMiddleware.js'

export const allocationRoutes = express.Router();
allocationRoutes.use(auth)

allocationRoutes.get('/dashboard/summary', requireAllocationAccess, allocationController.summary)
allocationRoutes.get('/options', requireAllocationAccess, allocationController.options)
allocationRoutes.get('/history', requireAllocationAccess, allocationController.history)
allocationRoutes.get('/transfers', requireAllocationAccess, allocationController.listTransfers)
allocationRoutes.post('/transfers', authorize('Admin', 'Asset Manager', 'Department Head'), validateTransferPayload, allocationController.requestTransfer)
allocationRoutes.put('/transfers/:id/approve', authorize('Admin', 'Asset Manager'), allocationController.approveTransfer)
allocationRoutes.put('/transfers/:id/reject', authorize('Admin', 'Asset Manager'), allocationController.rejectTransfer)

allocationRoutes.post(
  "/",
  authorize('Admin', 'Asset Manager'),
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
  authorize('Admin', 'Asset Manager', 'Department Head'),
  validateReturnPayload,
  allocationController.returnAllocation,
);
allocationRoutes.put(
  "/:id",
  authorize('Admin', 'Asset Manager'),
  validateAllocationPayload,
  allocationController.update,
);
allocationRoutes.delete(
  "/:id",
  requireAllocationAccess,
  allocationController.remove,
);
allocationRoutes.get(
  "/:id/history",
  requireAllocationAccess,
  allocationController.history,
);

export default allocationRoutes;
