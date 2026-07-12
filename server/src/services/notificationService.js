import { Notification } from "../models/Notification.js";
import { ActivityLog } from "../models/ActivityLog.js";
import { Reminder } from "../models/Reminder.js";
import { Booking } from "../models/Booking.js";
import { Allocation } from "../models/Allocation.js";
import { Maintenance } from "../models/Maintenance.js";
import { AuditCycle } from "../models/AuditCycle.js";

const triggerText = {
  "Booking Created": "Booking created",
  "Booking Updated": "Booking updated",
  "Booking Cancelled": "Booking cancelled",
  "Booking Reminder": "Booking reminder",
  "Booking Completed": "Booking completed",
  "Maintenance Request Raised": "Maintenance request raised",
  "Maintenance Approved": "Maintenance approved",
  "Maintenance Rejected": "Maintenance rejected",
  "Technician Assigned": "Technician assigned",
  "Repair Started": "Repair started",
  "Repair Completed": "Repair completed",
  "Audit Cycle Created": "Audit cycle created",
  "Auditor Assigned": "Auditor assigned",
  "Audit Started": "Audit started",
  "Asset Verified": "Asset verified",
  "Discrepancy Detected": "Discrepancy detected",
  "Audit Completed": "Audit completed",
  "Asset Assigned": "Asset assigned",
  "Asset Returned": "Asset returned",
  "Transfer Requested": "Transfer requested",
  "Transfer Approved": "Transfer approved",
  "Transfer Rejected": "Transfer rejected",
};

const bookingPriority = {
  "Booking Cancelled": "Medium",
  "Booking Reminder": "Medium",
};
const maintenancePriority = {
  "Maintenance Rejected": "High",
};
const auditPriority = {
  "Auditor Assigned": "Medium",
  "Audit Started": "Medium",
  "Discrepancy Detected": "High",
  "Audit Completed": "Medium",
};

const bookingLabel = (booking) => booking?.purpose || "Resource booking";
const maintenanceLabel = (maintenance) => maintenance?.issue || "Maintenance request";
const auditLabel = (audit) => audit?.title || "Audit cycle";

export const notificationService = {
  async create({ user, title, message, type, priority = "Medium", relatedModule, relatedId }) {
    if (!user || !title || !message || !type) return null;
    return Notification.create({ user, title, message, type, priority, relatedModule, relatedId });
  },

  async list(user, query = {}) {
    const filter = { user };
    if (query.type) filter.type = query.type;
    if (query.priority) filter.priority = query.priority;
    if (query.isRead !== undefined) filter.isRead = query.isRead === "true" || query.isRead === true;
    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: "i" } },
        { message: { $regex: query.search, $options: "i" } },
      ];
    }

    return Notification.find(filter).sort({ createdAt: -1 });
  },

  async getById(id, user) {
    return Notification.findOne({ _id: id, user });
  },

  async markRead(id, user) {
    return Notification.findOneAndUpdate({ _id: id, user }, { isRead: true }, { new: true });
  },

  async markAllRead(user) {
    const result = await Notification.updateMany({ user, isRead: false }, { isRead: true });
    return { modified: result.modifiedCount || 0 };
  },

  async remove(id, user) {
    return Notification.findOneAndDelete({ _id: id, user });
  },

  async createForBooking(trigger, booking, extraMessage = "") {
    if (!booking?._id) return null;
    const title = triggerText[trigger] || trigger;
    const message =
      extraMessage ||
      `${bookingLabel(booking)} for ${booking.startTime || "-"} - ${booking.endTime || "-"} on ${new Date(booking.bookingDate).toLocaleDateString()} was ${title.toLowerCase()}.`;

    return this.create({
      user: booking.employee,
      title,
      message,
      type: "Booking",
      priority: bookingPriority[trigger] || "Low",
      relatedModule: "Booking",
      relatedId: booking._id,
    });
  },

  async createForMaintenance(trigger, maintenance, extraMessage = "") {
    if (!maintenance?._id) return null;
    const title = triggerText[trigger] || trigger;
    const message = extraMessage || `${maintenanceLabel(maintenance)} was ${title.toLowerCase()}.`;

    return this.create({
      user: maintenance.requestedBy,
      title,
      message,
      type: "Maintenance",
      priority: maintenancePriority[trigger] || "Medium",
      relatedModule: "Maintenance",
      relatedId: maintenance._id,
    });
  },

  async createForAudit(trigger, audit, recipient, extraMessage = "") {
    if (!audit?._id || !recipient) return null;
    const title = triggerText[trigger] || trigger;
    const message = extraMessage || `${auditLabel(audit)} ${title.toLowerCase()}.`;

    return this.create({
      user: recipient,
      title,
      message,
      type: "Audit",
      priority: auditPriority[trigger] || "Low",
      relatedModule: "Audit",
      relatedId: audit._id,
    });
  },

};

export const activityLogService = {
  async log({ user, action, module, resourceId, description, ipAddress }) {
    if (!user || !action || !module) return null;
    return ActivityLog.create({ user, action, module, resourceId, description, ipAddress });
  },

  async list(query = {}) {
    const filter = {};
    if (query.module) filter.module = query.module;
    if (query.action) filter.action = query.action;
    if (query.user) filter.user = query.user;
    if (query.date) {
      const start = new Date(`${query.date}T00:00:00`);
      const end = new Date(`${query.date}T23:59:59.999`);
      filter.createdAt = { $gte: start, $lte: end };
    }

    return ActivityLog.find(filter)
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .limit(500);
  },
};

const upsertReminder = (filter, data) =>
  Reminder.updateOne(filter, { $setOnInsert: { ...filter, ...data } }, { upsert: true });

export const reminderService = {
  async list(user, query = {}) {
    await this.generateAutomaticReminders(user);

    const filter = { user };
    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;

    return Reminder.find(filter).sort({ reminderDate: 1 });
  },

  async create(data) {
    if (!data.user || !data.title || !data.reminderDate || !data.type) return null;
    return Reminder.create(data);
  },

  async update(id, data, user) {
    const allowed = ["title", "message", "reminderDate", "type", "status"];
    const changes = Object.fromEntries(allowed.filter((key) => data[key] !== undefined).map((key) => [key, data[key]]));
    return Reminder.findOneAndUpdate({ _id: id, user }, changes, { new: true, runValidators: true });
  },

  async remove(id, user) {
    return Reminder.findOneAndDelete({ _id: id, user });
  },

  async generateAutomaticReminders(user) {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingBookings = await Booking.find({
      employee: user,
      status: "Upcoming",
      bookingDate: { $gte: now, $lte: next24Hours },
    });
    await Promise.all(
      upcomingBookings.map((booking) => {
        const message = `${booking.purpose || "Resource booking"} on ${new Date(booking.bookingDate).toLocaleDateString()} from ${booking.startTime} to ${booking.endTime}.`;
        return upsertReminder(
          { user, type: "Booking", message },
          { title: "Upcoming Booking", reminderDate: booking.bookingDate, status: "Pending" },
        );
      }),
    );

    const overdueAllocations = await Allocation.find({
      assignedTo: user,
      status: "active",
      expectedReturnDate: { $lt: now },
    }).populate("asset", "name assetTag");
    await Promise.all(
      overdueAllocations.map((allocation) => {
        const message = `Return ${allocation.asset?.name || "asset"} (${allocation.asset?.assetTag || "-"}) — was due ${new Date(allocation.expectedReturnDate).toLocaleDateString()}.`;
        return upsertReminder(
          { user, type: "Return", message },
          { title: "Overdue Return", reminderDate: allocation.expectedReturnDate, status: "Pending" },
        );
      }),
    );

    const dueMaintenance = await Maintenance.find({
      requestedBy: user,
      status: "Approved",
    }).populate("asset", "name assetTag");
    await Promise.all(
      dueMaintenance.map((maintenance) => {
        const message = `${maintenance.asset?.name || "Asset"} (${maintenance.asset?.assetTag || "-"}) maintenance is approved and awaiting a technician.`;
        return upsertReminder(
          { user, type: "Maintenance", message },
          { title: "Maintenance Due", reminderDate: maintenance.approvedDate || maintenance.requestedDate, status: "Pending" },
        );
      }),
    );

    const startingAudits = await AuditCycle.find({
      createdBy: user,
      status: "Scheduled",
      startDate: { $gte: now, $lte: next24Hours },
    });
    await Promise.all(
      startingAudits.map((cycle) => {
        const message = `${cycle.title} is scheduled to start ${new Date(cycle.startDate).toLocaleDateString()}.`;
        return upsertReminder(
          { user, type: "Audit", message },
          { title: "Audit Start", reminderDate: cycle.startDate, status: "Pending" },
        );
      }),
    );
  },
};

export default notificationService;
