import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/authRoutes.js";
import { allocationRoutes } from "./src/routes/allocationRoutes.js";
import { departmentRoutes } from './routes/departmentRoutes.js'
import { categoryRoutes } from './routes/categoryRoutes.js'
import { employeeRoutes } from './routes/employeeRoutes.js'

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
app.use('/api/departments', departmentRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/employees', employeeRoutes)
app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});
