import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import { notFound, errorHandler } from "./middleware/error.js";

const app = express();

// Render runs the application behind a proxy.
// This allows express-rate-limit to correctly read
// the X-Forwarded-For header.
app.set("trust proxy", 1);

// Render provides the PORT environment variable.
// 5000 is used when running locally.
const PORT = process.env.PORT || 5000;

// --------------------------------------------------
// Security
// --------------------------------------------------

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// --------------------------------------------------
// Body parsing
// --------------------------------------------------

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// --------------------------------------------------
// Root route
// --------------------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    message: "TaskFlow AI API is running",
    status: "success",
  });
});

// --------------------------------------------------
// Health check
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "TaskFlow AI API",
  });
});

// --------------------------------------------------
// API routes
// --------------------------------------------------

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);

// --------------------------------------------------
// 404 + Error handling
// --------------------------------------------------

app.use(notFound);
app.use(errorHandler);

// --------------------------------------------------
// MongoDB + Server startup
// --------------------------------------------------

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`TaskFlow AI API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  });