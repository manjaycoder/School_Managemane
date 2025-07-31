import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dashboardRoutes from "./Routes/TotalAmount.js";
import dotenv from "dotenv";
import RoutesFeesApply from "../src/Routes/RoutesFeesApply.js";
import { fileURLToPath } from "url";
import TransferRoutes from "./Routes/TransferRoutes.js";
import studentRoutes from "./Routes/studentRoute.js";
import classRoutes from "./Routes/classRoutes.js";
import feesRoutes from "./Routes/feesRoutes.js";
import "./Config/db.js";
import CreateAccount from "./Routes/accountRoutes.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());



const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use("/uploads", express.static(uploadDir));
app.use("/api/fees", feesRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/accounts", CreateAccount);
app.use("/applyRouter", RoutesFeesApply);
app.use("/routes", TransferRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/test", (req, res) => {
  res.send("Test route working");
});
app.get("/", (_, res) => {
  res.send("👋 Welcome to School Management System API");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "❌ Route not found" });
});
app.use((err, req, res, next) => {
  console.error("❗ Server Error:", err.message, err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    details: err.message // TEMPORARILY SEND ERROR MESSAGE
  });
});
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
