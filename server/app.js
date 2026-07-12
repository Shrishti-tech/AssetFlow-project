import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/authRoutes.js";
import { allocationRoutes } from "./src/routes/allocationRoutes.js";
import { bookingRoutes } from "./src/routes/bookingRoutes.js";
import { maintenanceRoutes } from "./src/routes/maintenanceRoutes.js";
import { departmentRoutes } from "./routes/departmentRoutes.js";
import { categoryRoutes } from "./routes/categoryRoutes.js";
import { employeeRoutes } from "./routes/employeeRoutes.js";
import { assetRoutes } from "./routes/assetRoutes.js";
import { notificationRoutes } from "./routes/notificationRoutes.js";

export const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/maintenance", maintenanceRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/notifications", notificationRoutes);
app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: error.message });
  }
  if (error.code === 11000) {
    return res
      .status(409)
      .json({ message: "An asset with this unique value already exists." });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource ID." });
  }
  if (error.status) return res.status(error.status).json({ message: error.message });
  res.status(500).json({ message: "Something went wrong. Please try again." });
});
