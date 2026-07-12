import { Booking } from "../models/Booking.js";
import { BookingHistory } from "../models/BookingHistory.js";
import { Resource } from "../models/Resource.js";

const createHistoryEntry = async (
  bookingId,
  action,
  performedBy,
  details = {},
) => {
  return BookingHistory.create({
    booking: bookingId,
    action,
    performedBy,
    details,
  });
};

const toMinutes = (timeString) => {
  const [hours, minutes] = timeString.split(":").map(Number);
  return hours * 60 + minutes;
};

const validateBookingWindow = (bookingDate, startTime, endTime) => {
  const bookingDateTime = new Date(bookingDate);
  const now = new Date();
  const startDateTime = new Date(
    `${bookingDateTime.toISOString().split("T")[0]}T${startTime}`,
  );
  const endDateTime = new Date(
    `${bookingDateTime.toISOString().split("T")[0]}T${endTime}`,
  );

  if (startDateTime < now) {
    throw new Error("Booking cannot be in the past.");
  }

  if (toMinutes(startTime) >= toMinutes(endTime)) {
    throw new Error("Start time must be earlier than end time.");
  }

  return { startDateTime, endDateTime };
};

const hasOverlap = async (
  resourceId,
  bookingDate,
  startTime,
  endTime,
  excludeId = null,
) => {
  const { startDateTime, endDateTime } = validateBookingWindow(
    bookingDate,
    startTime,
    endTime,
  );

  const query = {
    resource: resourceId,
    bookingDate: new Date(bookingDate),
    status: { $ne: "Cancelled" },
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const conflicting = await Booking.findOne(query);
  return Boolean(conflicting);
};

export const bookingService = {
  async list(query = {}) {
    return Booking.find(query)
      .populate("resource employee")
      .sort({ bookingDate: 1, startTime: 1 });
  },

  async getById(id) {
    return Booking.findById(id).populate("resource employee");
  },

  async create(data) {
    const resource = await Resource.findById(data.resource);
    if (!resource) {
      throw new Error("Resource must exist.");
    }

    if (!resource.isBookable) {
      throw new Error("Resource must be bookable.");
    }

    validateBookingWindow(data.bookingDate, data.startTime, data.endTime);

    const overlap = await hasOverlap(
      data.resource,
      data.bookingDate,
      data.startTime,
      data.endTime,
    );
    if (overlap) {
      throw new Error("Booking time overlaps with an existing booking.");
    }

    const booking = await Booking.create({
      ...data,
      status: data.status || "Upcoming",
    });
    await createHistoryEntry(booking._id, "Created", data.performedBy || null, {
      data,
    });

    if (booking.resource) {
      await Resource.findByIdAndUpdate(booking.resource, { status: "booked" });
    }

    return booking;
  },

  async update(id, data) {
    const existingBooking = await Booking.findById(id);
    if (!existingBooking) {
      return null;
    }

    const resourceId = data.resource || existingBooking.resource;
    const resource = await Resource.findById(resourceId);
    if (!resource) {
      throw new Error("Resource must exist.");
    }

    if (!resource.isBookable) {
      throw new Error("Resource must be bookable.");
    }

    const bookingDate = data.bookingDate || existingBooking.bookingDate;
    const startTime = data.startTime || existingBooking.startTime;
    const endTime = data.endTime || existingBooking.endTime;

    validateBookingWindow(bookingDate, startTime, endTime);

    const overlap = await hasOverlap(
      resourceId,
      bookingDate,
      startTime,
      endTime,
      id,
    );
    if (overlap) {
      throw new Error("Booking time overlaps with an existing booking.");
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { ...data, bookingDate, startTime, endTime },
      { new: true, runValidators: true },
    );

    if (booking) {
      await createHistoryEntry(
        booking._id,
        "Updated",
        data.performedBy || null,
        { data },
      );
    }
    return booking;
  },

  async remove(id) {
    const booking = await Booking.findByIdAndDelete(id);
    if (booking) {
      await BookingHistory.deleteMany({ booking: booking._id });
    }
    return booking;
  },

  async cancel(id, data = {}) {
    const booking = await Booking.findByIdAndUpdate(
      id,
      {
        status: "Cancelled",
        remarks: data.remarks || "Cancelled",
      },
      { new: true, runValidators: true },
    );

    if (booking) {
      await createHistoryEntry(
        booking._id,
        "Cancelled",
        data.performedBy || null,
        { data },
      );
      await Resource.findByIdAndUpdate(booking.resource, {
        status: "available",
      });
    }

    return booking;
  },

  async calendar(query = {}) {
    const filter = {};
    if (query.startDate || query.endDate) {
      filter.bookingDate = {};
      if (query.startDate) filter.bookingDate.$gte = new Date(query.startDate);
      if (query.endDate) filter.bookingDate.$lte = new Date(query.endDate);
    }

    const bookings = await Booking.find(filter)
      .populate("resource employee")
      .sort({ bookingDate: 1, startTime: 1 });

    return bookings.map((booking) => ({
      id: booking._id,
      title: booking.purpose || booking.resource?.name || "Booking",
      start: `${booking.bookingDate.toISOString().split("T")[0]}T${booking.startTime}`,
      end: `${booking.bookingDate.toISOString().split("T")[0]}T${booking.endTime}`,
      status: booking.status,
      resource: booking.resource?.name,
      employee: booking.employee?.name || booking.employee?.email,
    }));
  },
};

export default bookingService;
