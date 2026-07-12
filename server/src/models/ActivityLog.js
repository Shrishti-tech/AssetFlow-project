import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: { type: String, required: true, trim: true, maxlength: 150, index: true },
    module: { type: String, required: true, trim: true, maxlength: 100, index: true },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    description: { type: String, trim: true, maxlength: 2000 },
    ipAddress: { type: String, trim: true, maxlength: 64 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ActivityLog =
  mongoose.models.ActivityLog || mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
