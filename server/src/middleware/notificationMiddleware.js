const reminderTypes = ["Booking", "Return", "Maintenance", "Audit"];
const reminderStatuses = ["Pending", "Sent", "Cancelled"];

export function requireActivityAccess(req, res, next) {
  if (!["Admin", "Asset Manager"].includes(req.user?.role)) {
    return res.status(403).json({ message: "Only Admin or Asset Manager can view activity logs." });
  }
  return next();
}

export function validateReminderPayload(req, res, next) {
  const { title, reminderDate, type } = req.body;
  if (!title?.trim() || !reminderDate || !type) {
    return res.status(400).json({ message: "Title, reminder date and type are required." });
  }
  if (!reminderTypes.includes(type)) {
    return res.status(400).json({ message: `type must be one of: ${reminderTypes.join(", ")}.` });
  }
  return next();
}

export function validateReminderUpdate(req, res, next) {
  if (req.body.type && !reminderTypes.includes(req.body.type)) {
    return res.status(400).json({ message: `type must be one of: ${reminderTypes.join(", ")}.` });
  }
  if (req.body.status && !reminderStatuses.includes(req.body.status)) {
    return res.status(400).json({ message: `status must be one of: ${reminderStatuses.join(", ")}.` });
  }
  return next();
}

export default {
  requireActivityAccess,
  validateReminderPayload,
  validateReminderUpdate,
};
