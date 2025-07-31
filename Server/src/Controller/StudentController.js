import express from "express";

import pool from "../Config/db.js";
import { cleanupFiles } from "../utils/fileUtils.js";
import upload from "../Config/multer.js";

export const getStudentByAdmissionNumber = async (req, res) => {
  const { admissionNumber } = req.params;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM students WHERE admissionNumber = ?`,
      [admissionNumber]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const student = rows[0];

    // Fallback: all months
    const allMonths = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Student's available months (or fallback to all)
    const studentMonths = student.months
      ? student.months.split(",").map((m) => m.trim())
      : allMonths;

    res.status(200).json({
      success: true,
      student,
      months: studentMonths,
    });
  } catch (err) {
    console.error("Error fetching student:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const addStudent = [
  upload.fields([
    { name: "fatherImage", maxCount: 1 },
    { name: "motherImage", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  async (req, res) => {
    let connection;
    try {
      const data = req.body;
      const files = req.files || {};

      const requiredFields = {
        firstName: "First name is required",
        lastName: "Last name is required",
        dob: "Date of birth is required",
        class: "Class is required",
        section: "Section is required",
        routeName: "Route name is required", // Added
        fatherName: "Father's name is required",
        fatherPhoneNumber: "Father's phone number is required",
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key]) => !data[key])
        .map(([, msg]) => msg);

      if (missingFields.length > 0) {
        cleanupFiles(files);
        return res.status(400).json({
          error: "Validation failed",
          details: missingFields,
        });
      }

      const processFile = (fileArray) =>
        fileArray && fileArray.length > 0 ? fileArray[0].filename : null;

      const fatherImage = processFile(files.fatherImage);
      const motherImage = processFile(files.motherImage);
      const documents = (files.documents || []).map((f) => f.filename);

      connection = await pool.getConnection();
      await connection.beginTransaction();

      const sql = `INSERT INTO students (
        admissionNumber, firstName, middleName, lastName, dob, class, section, routeName,
        email, bloodGroup, gender, height, weight, category, religion, caste,
        fatherName, fatherPhoneNumber, fatherOccupation, fatherQualification,
        fatherAdharNo, fatherImage, motherName, motherPhoneNumber,
        motherOccupation, motherAdharNo, motherImage, documents,
        admissionDate, rollNo, currentAddress, permanentAddress
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; 

      const values = [
        data.admissionNumber,
        data.firstName,
        data.middleName || null,
        data.lastName,
        data.dob,
        data.class,
        data.section,
        data.routeName, // Added
        data.email || null,
        data.bloodGroup || null,
        data.gender || null,
        data.height || null,
        data.weight || null,
        data.category || null,
        data.religion || null,
        data.caste || null,
        data.fatherName,
        data.fatherPhoneNumber,
        data.fatherOccupation || null,
        data.fatherQualification || null,
        data.fatherAdharNo || null,
        fatherImage || null,
        data.motherName || null,
        data.motherPhoneNumber || null,
        data.motherOccupation || null,
        data.motherAdharNo || null,
        motherImage || null,
        documents.length > 0 ? JSON.stringify(documents) : null,
        data.admissionDate || new Date().toISOString().slice(0, 10),
        data.rollNo || null,
        data.currentAddress || null,
        data.permanentAddress || null,
      ];

      const [result] = await connection.execute(sql, values);
      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Student added successfully",
        studentId: result.insertId,
      });
    } catch (err) {
      if (connection) await connection.rollback();
      cleanupFiles(req.files);

      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Student already exists" });
      }

      res.status(500).json({
        error: "Database operation failed",
        ...(process.env.NODE_ENV === "development" && { details: err.message }),
      });
    } finally {
      if (connection) connection.release();
    }
  },
];


export const getStudents = async (req, res) => {
  try {
    const { class: className, section, keyword } = req.query;
    let query = `SELECT id, firstName, middleName, lastName, class, section, 
                fatherName, motherName, dob, gender, rollNo, fatherPhoneNumber AS mobileNo 
                FROM students WHERE 1=1`;
    const params = [];

    if (className) {
      query += ` AND class = ?`;
      params.push(className);
    }

    if (section) {
      query += ` AND section = ?`;
      params.push(section);
    }

    if (keyword) {
      query += ` AND (firstName LIKE ? OR lastName LIKE ? OR fatherName LIKE ?)`;
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    const [students] = await pool.query(query, params);
    res.status(200).json(students.map(formatStudent));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

function formatStudent(student) {
  return {
    admissionNo: student.id || "—",
    studentName: [student.firstName, student.middleName, student.lastName]
      .filter(Boolean)
      .join(" "),
    class: student.class,
    section: student.section,
    fatherName: student.fatherName,
    motherName: student.motherName,
    dob: student.dob,
    gender: student.gender,
    rollNo: student.rollNo,
    mobileNo: student.mobileNo,
  };
}
