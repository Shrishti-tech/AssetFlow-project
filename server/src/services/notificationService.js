import { Notification } from "../../models/Notification.js";
import { Booking } from "../models/Booking.js";

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
};

const bookingLabel = (booking) => booking?.purpose || "Resource booking";
const maintenanceLabel = (maintenance) => maintenance?.issue || "Maintenance request";
const auditLabel = (audit) => audit?.title || "Audit cycle";

export const notificationService = {
  async list(query = {}) {
    const filter = { ...query };
    delete filter.trigger;
    delete filter.read;
    delete filter.recipient;
    if (query.trigger) filter.trigger = query.trigger;
    if (query.read !== undefined) filter.read = query.read === "true";
    if (query.recipient) {
      filter.$or = [{ recipient: query.recipient }, { user: query.recipient }];
    }

    return Notification.find(filter)
      .populate("booking recipient user")
      .sort({ createdAt: -1 });
  },

  async createForBooking(trigger, booking, extraMessage = "") {
    if (!booking?._id) return null;
    const title = triggerText[trigger] || trigger;
    const message =
      extraMessage ||
      `${bookingLabel(booking)} for ${booking.startTime || "-"} - ${booking.endTime || "-"} on ${new Date(booking.bookingDate).toLocaleDateString()} was ${title.toLowerCase()}.`;

    return Notification.create({
      trigger,
      title,
      message,
      booking: booking._id,
      user: booking.employee,
      recipient: booking.employee,
    });
  },

  async createForMaintenance(trigger, maintenance, extraMessage = "") {
    if (!maintenance?._id) return null;
    const title = triggerText[trigger] || trigger;
    const message =
      extraMessage ||
      `${maintenanceLabel(maintenance)} was ${title.toLowerCase()}.`;

    return Notification.create({
      trigger,
      title,
      message,
      maintenance: maintenance._id,
      user: maintenance.requestedBy,
      recipient: maintenance.requestedBy,
      type: trigger.includes("Rejected") ? "warning" : "info",
    });
  },

  async createForAudit(trigger, audit, recipient, extraMessage = "") {
    if (!audit?._id || !recipient) return null;
    const title = triggerText[trigger] || trigger;
    const message = extraMessage || `${auditLabel(audit)} ${title.toLowerCase()}.`;

    return Notification.create({
      trigger,
      title,
      message,
      audit: audit._id,
      user: recipient,
      recipient,
      type: trigger === "Discrepancy Detected" ? "warning" : "info",
    });
  },

  async markRead(filter) {
    return Notification.findOneAndUpdate(
      typeof filter === "string" ? { _id: filter } : filter,
      { read: true },
      { new: true, runValidators: true },
    );
  },

  async createBookingReminders() {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);
    const start = new Date(tomorrow.toISOString().slice(0, 10));
    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    const bookings = await Booking.find({
      status: "Upcoming",
      bookingDate: { $gte: start, $lt: end },
    });

    return Promise.all(
      bookings.map((booking) =>
        this.createForBooking(
          "Booking Reminder",
          booking,
          `${bookingLabel(booking)} is scheduled tomorrow from ${booking.startTime} to ${booking.endTime}.`,
        ),
      ),
    );
  },
};

export default notificationService;
