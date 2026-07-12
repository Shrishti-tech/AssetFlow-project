import mongoose from "mongoose";

const auditCycleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    scope: { type: String, trim: true, maxlength: 200 },
    department: { type: String, trim: true, maxlength: 100 },
    location: { type: String, trim: true, maxlength: 150 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
      default: "Scheduled",
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    description: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true },
);

export const AuditCycle =
  mongoose.models.AuditCycle || mongoose.model("AuditCycle", auditCycleSchema);
export default AuditCycle;
