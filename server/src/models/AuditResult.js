import mongoose from "mongoose";

const auditResultSchema = new mongoose.Schema(
  {
    auditCycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuditCycle",
      required: true,
      index: true,
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
      index: true,
    },
    auditor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Verified", "Missing", "Damaged", "Lost"],
      required: true,
    },
    remarks: { type: String, trim: true, maxlength: 2000 },
    verifiedAt: { type: Date, default: Date.now },
    images: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

auditResultSchema.index({ auditCycle: 1, asset: 1 }, { unique: true });

export const AuditResult =
  mongoose.models.AuditResult || mongoose.model("AuditResult", auditResultSchema);
export default AuditResult;
