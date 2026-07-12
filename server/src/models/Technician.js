import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, maxlength: 30 },
    specialization: { type: String, trim: true, maxlength: 120 },
    department: { type: String, trim: true, maxlength: 100 },
    status: {
      type: String,
      enum: ["Available", "Busy", "Offline"],
      default: "Available",
      index: true,
    },
  },
  { timestamps: true },
);

export const Technician =
  mongoose.models.Technician ||
  mongoose.model("Technician", technicianSchema);
export default Technician;
