import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, trim: true, maxlength: 2000 },
    reminderDate: { type: Date, required: true, index: true },
    type: {
      type: String,
      enum: ["Booking", "Return", "Maintenance", "Audit"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Sent", "Cancelled"],
      default: "Pending",
      index: true,
    },
  },
  { timestamps: true },
);

export const Reminder =
  mongoose.models.Reminder || mongoose.model("Reminder", reminderSchema);
export default Reminder;
