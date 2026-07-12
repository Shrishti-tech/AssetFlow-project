import { Notification } from "../../models/Notification.js";
import { Booking } from "../models/Booking.js";

const triggerText = {
  "Booking Created": "Booking created",
  "Booking Updated": "Booking updated",
  "Booking Cancelled": "Booking cancelled",
  "Booking Reminder": "Booking reminder",
  "Booking Completed": "Booking completed",
};

const bookingLabel = (booking) => booking?.purpose || "Resource booking";

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
