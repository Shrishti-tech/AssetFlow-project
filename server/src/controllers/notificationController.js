import notificationService, { activityLogService, reminderService } from "../services/notificationService.js";

export const notificationController = {
  async list(req, res, next) {
    try {
      const notifications = await notificationService.list(req.user._id, req.query);
      res.json({ notifications });
    } catch (error) {
      next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const notification = await notificationService.getById(req.params.id, req.user._id);
      if (!notification) return res.status(404).json({ message: "Notification not found." });
      return res.json({ notification });
    } catch (error) {
      return next(error);
    }
  },

  async markRead(req, res, next) {
    try {
      const notification = await notificationService.markRead(req.params.id, req.user._id);
      if (!notification) return res.status(404).json({ message: "Notification not found." });
      return res.json({ notification });
    } catch (error) {
      return next(error);
    }
  },

  async markAllRead(req, res, next) {
    try {
      const result = await notificationService.markAllRead(req.user._id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const notification = await notificationService.remove(req.params.id, req.user._id);
      if (!notification) return res.status(404).json({ message: "Notification not found." });
      return res.json({ message: "Notification deleted." });
    } catch (error) {
      return next(error);
    }
  },
};

export const activityController = {
  async list(req, res, next) {
    try {
      const logs = await activityLogService.list(req.query);
      res.json({ logs });
    } catch (error) {
      next(error);
    }
  },
};

export const reminderController = {
  async list(req, res, next) {
    try {
      const reminders = await reminderService.list(req.user._id, req.query);
      res.json({ reminders });
    } catch (error) {
      next(error);
    }
  },

  async create(req, res, next) {
    try {
      const reminder = await reminderService.create({ ...req.body, user: req.user._id });
      res.status(201).json({ reminder });
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const reminder = await reminderService.update(req.params.id, req.body, req.user._id);
      if (!reminder) return res.status(404).json({ message: "Reminder not found." });
      return res.json({ reminder });
    } catch (error) {
      return next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const reminder = await reminderService.remove(req.params.id, req.user._id);
      if (!reminder) return res.status(404).json({ message: "Reminder not found." });
      return res.json({ message: "Reminder deleted." });
    } catch (error) {
      return next(error);
    }
  },
};

export default notificationController;
