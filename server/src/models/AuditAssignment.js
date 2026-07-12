import mongoose from "mongoose";

const auditAssignmentSchema = new mongoose.Schema(
  {
    auditCycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuditCycle",
      required: true,
      index: true,
    },
    auditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Assigned", "Accepted", "Completed"],
      default: "Assigned",
    },
  },
  { timestamps: true },
);

auditAssignmentSchema.index({ auditCycle: 1, auditor: 1 }, { unique: true });

export const AuditAssignment =
  mongoose.models.AuditAssignment ||
  mongoose.model("AuditAssignment", auditAssignmentSchema);
export default AuditAssignment;
