import express from "express";
import {
  addFeesPlan,
  getStudentByAdmission,
  applyFees,
  addFeesHeading
} from "../Controller/FeesController.js";

const router = express.Router();

// POST /api/fees/plan
router.post("/plan", addFeesPlan);
router.post("/", addFeesHeading);
// POST /api/fees/apply
router.post("/apply", applyFees);

// GET /api/fees/student/:admissionNumber
router.get("/student/:admissionNumber", getStudentByAdmission);

export default router;