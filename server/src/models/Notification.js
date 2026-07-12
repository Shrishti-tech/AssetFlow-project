import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    type: {
      type: String,
      enum: ["Asset", "Booking", "Maintenance", "Audit", "System"],
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    isRead: { type: Boolean, default: false, index: true },
    relatedModule: { type: String, trim: true, maxlength: 100 },
    relatedId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true },
);

export const Notification =
  mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;
