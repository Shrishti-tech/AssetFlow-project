import mongoose from "mongoose";

const maintenanceHistorySchema = new mongoose.Schema(
  {
    maintenance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Maintenance",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: [
        "Maintenance Created",
        "Approved",
        "Rejected",
        "Technician Assigned",
        "Repair Started",
        "Completed",
      ],
      required: true,
    },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    details: { type: Object, default: {} },
  },
  { timestamps: true },
);

export const MaintenanceHistory =
  mongoose.models.MaintenanceHistory ||
  mongoose.model("MaintenanceHistory", maintenanceHistorySchema);
export default MaintenanceHistory;
