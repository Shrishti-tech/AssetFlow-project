import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    allocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Allocation",
      unique: true,
      sparse: true,
    },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", index: true },
    trigger: {
      type: String,
      enum: [
        "Booking Created",
        "Booking Updated",
        "Booking Cancelled",
        "Booking Reminder",
        "Booking Completed",
      ],
      index: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: { type: String, enum: ["info", "warning", "error"], default: "info" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
