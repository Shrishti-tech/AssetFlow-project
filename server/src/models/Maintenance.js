import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
      index: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    technician: { type: mongoose.Schema.Types.ObjectId, ref: "Technician" },
    issue: { type: String, required: true, trim: true, maxlength: 2000 },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    attachments: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Technician Assigned",
        "In Progress",
        "Resolved",
        "Rejected",
      ],
      default: "Pending",
      index: true,
    },
    requestedDate: { type: Date, default: Date.now },
    approvedDate: { type: Date },
    completedDate: { type: Date },
    remarks: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true },
);

maintenanceSchema.index({ asset: 1, status: 1 });

export const Maintenance =
  mongoose.models.Maintenance ||
  mongoose.model("Maintenance", maintenanceSchema);
export default Maintenance;
