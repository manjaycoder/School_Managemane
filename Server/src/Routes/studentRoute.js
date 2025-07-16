import express from "express";
import {
  addStudent,
  getStudents,
  getStudentById,
  getStudentByAdmissionNumber,
} from "../Controller/StudentController.js";

const router = express.Router();

router.post("/", addStudent);
router.get("/", getStudents);
router.get("/:id", getStudentById);
router.get("/student/:admissionNumber", getStudentByAdmissionNumber);
export default router;
