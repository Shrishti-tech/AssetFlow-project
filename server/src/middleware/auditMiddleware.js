const cycleStatuses = ["Scheduled", "In Progress", "Completed", "Cancelled"];
const resultStatuses = ["Verified", "Missing", "Damaged", "Lost"];

export function requireAdmin(req, res, next) {
  if (req.user?.role !== "Admin") {
    return res.status(403).json({ message: "Only an Admin can perform this action." });
  }
  return next();
}

export function requireAuditManager(req, res, next) {
  if (!["Admin", "Asset Manager"].includes(req.user?.role)) {
    return res.status(403).json({ message: "Only Admin or Asset Manager can manage audit cycles." });
  }
  return next();
}

export function validateAuditCyclePayload(req, res, next) {
  const { title, startDate, endDate, status } = req.body;
  if (!title?.trim() || !startDate || !endDate) {
    return res.status(400).json({ message: "Title, start date and end date are required." });
  }
  if (status && !cycleStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid audit cycle status." });
  }
  return next();
}

export function validateAssignmentPayload(req, res, next) {
  if (!req.body.auditor) {
    return res.status(400).json({ message: "Auditor is required." });
  }
  return next();
}

export function validateVerificationPayload(req, res, next) {
  const { asset, status } = req.body;
  if (!asset || !status) {
    return res.status(400).json({ message: "Asset and verification status are required." });
  }
  if (!resultStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid verification status." });
  }
  return next();
}

export default {
  requireAdmin,
  requireAuditManager,
  validateAuditCyclePayload,
  validateAssignmentPayload,
  validateVerificationPayload,
};
