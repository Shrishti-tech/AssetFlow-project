import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    department: { type: String, trim: true },
    location: { type: String, trim: true },
    status: {
      type: String,
      enum: [
        "active",
        "returned",
        "pending",
        "maintenance",
        "lost",
        "disposed",
      ],
      default: "active",
    },
    allocatedAt: { type: Date, default: Date.now },
    returnedAt: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

export const Allocation = mongoose.model("Allocation", allocationSchema);
export default Allocation;
