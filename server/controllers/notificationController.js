import notificationService from "../src/services/notificationService.js";

const userFilter = (req) =>
  req.user.role === "Admin"
    ? {}
    : { $or: [{ user: req.user._id }, { recipient: req.user._id }] };

export async function listNotifications(req, res, next) {
  try {
    const notifications = await notificationService.list({
      ...req.query,
      ...userFilter(req),
    });
    res.json({ notifications });
  } catch (error) {
    next(error);
  }
}

export async function markRead(req, res, next) {
  try {
    const filter =
      req.user.role === "Admin"
        ? { _id: req.params.id }
        : {
            _id: req.params.id,
            $or: [{ user: req.user._id }, { recipient: req.user._id }],
          };
    const notification = await notificationService.markRead(filter);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }
    return res.json({ notification });
  } catch (error) {
    return next(error);
  }
}

export async function createBookingReminders(_req, res, next) {
  try {
    const notifications = await notificationService.createBookingReminders();
    res.status(201).json({ notifications });
  } catch (error) {
    next(error);
  }
}
