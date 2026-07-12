import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    capacity: { type: Number, default: 1 },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
    status: {
      type: String,
      enum: ["available", "booked", "maintenance", "disabled"],
      default: "available",
    },
    isBookable: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  { timestamps: true },
);

export const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
