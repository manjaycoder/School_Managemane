import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import studentRoutes from "./Routes/studentRoute.js";
import classRoutes from "./Routes/classRoutes.js";
import feesRoutes from "./Routes/feesRoutes.js";

import "./Config/db.js"; // auto-initialize DB
// Load env vars
dotenv.config();

// __dirname workaround in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({
  extended:true
}))
// Upload Directory Setup
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));


app.use("/api/fees", feesRoutes);
// Routes
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);

app.get("/test", (req, res) => {
  res.send("Test route working");
});

// Root Route
app.get("/", (_, res) => {
  res.send("👋 Welcome to School Management System API");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "❌ Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❗ Server Error:", err.stack || err);
  res.status(500).json({
    error: "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
