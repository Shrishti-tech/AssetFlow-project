import mongoose from "mongoose";

const allocationHistorySchema = new mongoose.Schema(
  {
    allocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Allocation",
      required: true,
      index: true,
    },
    action: {
      type: String,
      enum: ["allocated", "transfer_requested", "transfer_approved", "transferred", "transfer_rejected", "returned", "updated"],
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

export const AllocationHistory = mongoose.models.AllocationHistory || mongoose.model(
  "AllocationHistory",
  allocationHistorySchema,
);
export default AllocationHistory;
