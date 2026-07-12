import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
      index: true,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    department: { type: String, trim: true },
    purpose: { type: String, trim: true },
    bookingDate: { type: Date, required: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    remarks: { type: String, trim: true },
  },
  { timestamps: true },
);

export const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
