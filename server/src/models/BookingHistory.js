import mongoose from "mongoose";

const bookingHistorySchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["Created", "Updated", "Cancelled", "Completed", "Rescheduled"],
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    details: { type: Object, default: {} },
  },
  { timestamps: true },
);

export const BookingHistory = mongoose.model(
  "BookingHistory",
  bookingHistorySchema,
);
export default BookingHistory;
