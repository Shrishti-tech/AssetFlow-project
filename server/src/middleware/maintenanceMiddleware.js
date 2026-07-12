const priorities = ["Low", "Medium", "High", "Critical"];

export function validateMaintenanceRequest(req, res, next) {
  const { asset, issue, priority } = req.body;
  if (!asset || !issue?.trim()) {
    return res.status(400).json({ message: "Asset and issue description are required." });
  }
  if (priority && !priorities.includes(priority)) {
    return res.status(400).json({ message: "Invalid maintenance priority." });
  }
  return next();
}

export function validateTechnicianAssignment(req, res, next) {
  if (!req.body.technician) {
    return res.status(400).json({ message: "Technician is required." });
  }
  return next();
}

export function requireAssetManager(req, res, next) {
  if (!["Admin", "Asset Manager"].includes(req.user?.role)) {
    return res.status(403).json({ message: "Only Asset Manager can perform this action." });
  }
  return next();
}

export default {
  validateMaintenanceRequest,
  validateTechnicianAssignment,
  requireAssetManager,
};
