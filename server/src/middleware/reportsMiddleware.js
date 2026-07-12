const exportTypes = ["pdf", "csv", "xlsx"];
const exportReports = ["dashboard", "assets", "departments", "bookings", "maintenance"];

export function validateDateRange(req, res, next) {
  const { startDate, endDate } = req.query;
  if (startDate && Number.isNaN(Date.parse(startDate))) {
    return res.status(400).json({ message: "startDate must be a valid date." });
  }
  if (endDate && Number.isNaN(Date.parse(endDate))) {
    return res.status(400).json({ message: "endDate must be a valid date." });
  }
  if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ message: "startDate must be before endDate." });
  }
  return next();
}

export function validateExportRequest(req, res, next) {
  const { type, report = "dashboard" } = req.query;
  if (!exportTypes.includes(type)) {
    return res.status(400).json({ message: `type must be one of: ${exportTypes.join(", ")}.` });
  }
  if (!exportReports.includes(report)) {
    return res.status(400).json({ message: `report must be one of: ${exportReports.join(", ")}.` });
  }
  return next();
}

export default {
  validateDateRange,
  validateExportRequest,
};
