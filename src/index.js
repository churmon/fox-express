import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import connectDB from "./config/db.js";
import { auth } from "./lib/auth.js";
import userRoutes from "./routes/user.routes.js";
import vehicleCheckRoutes from "./routes/vehicleCheck.routes.js";

const app= express();
const PORT = process.env.PORT || 5000;
// Rollback to the previous version of the code, as the recent edits have already been applied.

// ─── Connect to MongoDB ───────────────────────────────────────────────────────
connectDB();

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,               // Required for cookies
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Better Auth handler (MUST come before body parsers) ──────────────────────
app.all("/api/auth/*splat", toNodeHandler(auth));

// ─── Body Parsers ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin"}
}));
app.use(express.urlencoded({ extended: true }));

// ─── Cookie Parser ────────────────────────────────────────────────────────────
app.use(cookieParser());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/vehicle", vehicleCheckRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// app.use((err, _req, res) => {
//   console.error(err);
//   res.status(500).json({ success: false, message: "Internal server error" });
// });

app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: err.message || "Something went wrong" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// export default app;