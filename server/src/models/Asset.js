import mongoose from "mongoose";

const assetSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    assetTag: { type: String, trim: true, unique: true, sparse: true },
    status: {
      type: String,
      enum: ["available", "allocated", "maintenance", "disposed", "lost"],
      default: "available",
    },
    category: { type: String, trim: true },
    department: { type: String, trim: true },
    location: { type: String, trim: true },
  },
  { timestamps: true },
);

export const Asset = mongoose.model("Asset", assetSchema);
export default Asset;
