import mongoose from "mongoose";

const transferRequestSchema = new mongoose.Schema(
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
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fromDepartment: { type: String, trim: true },
    toDepartment: { type: String, trim: true },
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
    },
    requestedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
  },
  { timestamps: true },
);

export const TransferRequest = mongoose.model(
  "TransferRequest",
  transferRequestSchema,
);
export default TransferRequest;
