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

export const addStudent = async (req, res) => {
  const data = req.body;
  const file = req.file;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Check duplicate admission number
    const [existingStudent] = await connection.query(
      "SELECT admissionNumber FROM students WHERE LOWER(TRIM(admissionNumber)) = LOWER(TRIM(?))",
      [data.admissionNumber]
    );
    if (existingStudent.length > 0) {
      return res
        .status(409)
        .json({ message: "Admission number already exists." });
    }
    // 2. Upload photo
    let photoPath = null;
    if (file) {
      const ext = path.extname(file.originalname);
      const fileName = `${data.admissionNumber}${ext}`;
      const uploadPath = path.join("uploads", fileName);
      await fs.writeFile(uploadPath, file.buffer);
      photoPath = uploadPath;
    }

    // 3. Insert into students table
    await connection.query(
      `INSERT INTO students (
        admissionNumber, roll_no, firstName, lastName, middleName, dob, gender, category,
        class, section, mobile, email, address, city, state, pincode, routeName, photo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.admissionNumber,
        data.roll_no,
        data.firstName,
        data.lastName,
        data.middleName,
        data.dob,
        data.gender,
        data.category,
        data.class,
        data.section,
        data.mobile,
        data.email,
        data.address,
        data.city,
        data.state,
        data.pincode,
        data.routeName,
        photoPath,
      ]
    );

    // 4. Get first 12 months
    const [feeMonths] = await connection.query(
      "SELECT month FROM months ORDER BY id LIMIT 12"
    );

    // 5. Get Academic Fees
    const [academicFees] = await connection.query(
      "SELECT amount FROM fees_plan WHERE class = ? LIMIT 1",
      [data.class]
    );
    const academicFee = academicFees.length > 0 ? academicFees[0].amount : 0;

    // 6. Get Transport Fees
    const [transportFees] = await connection.query(
      "SELECT amount FROM route_plans WHERE routeName = ? LIMIT 1",
      [data.routeName]
    );
    const transportFee = transportFees.length > 0 ? transportFees[0].amount : 0;

    // 7. Prepare fees_register insert data
    const now = new Date();
    const studentName =
      `${data.firstName} ${data.middleName} ${data.lastName}`.trim();
    const commonValues = {
      admissionNumber: data.admissionNumber,
      roll_no: data.roll_no || "",
      student_name: studentName,
      class: data.class,
      category: data.category,
      route: data.routeName,
      date: now.toISOString().split("T")[0],
    };

    const feesEntries = feeMonths.flatMap(({ month }) => [
      [
        commonValues.date,
        null, // rec_no
        commonValues.admissionNumber,
        commonValues.roll_no,
        commonValues.student_name,
        commonValues.class,
        commonValues.category,
        commonValues.route,
        month,
        academicFee,
        0, // late_fee
        0, // ledger_amt
        0, // discount
        academicFee,
        0, // recd_amt
        academicFee, // balance
      ],
      [
        commonValues.date,
        null,
        commonValues.admissionNumber,
        commonValues.roll_no,
        commonValues.student_name,
        commonValues.class,
        commonValues.category,
        commonValues.route,
        month,
        transportFee,
        0,
        0,
        0,
        transportFee,
        0,
        transportFee,
      ],
    ]);

    await connection.query(
      `INSERT INTO fees_register (
        date, rec_no, admissionNumber, roll_no, student_name, class, category, route,
        months, fees, late_fee, ledger_amt, discount, total, recd_amt, balance
      ) VALUES ?`,
      [feesEntries]
    );

    // 8. Insert into student_months table
    const monthsInsert = feeMonths.map(({ month }) => [
      data.admissionNumber,
      month,
    ]);
    await connection.query(
      "INSERT INTO student_months (admissionNumber, month) VALUES ?",
      [monthsInsert]
    );

    // 9. Commit
    await connection.commit();
    res
      .status(200)
      .json({ success: true, message: "Student and fees added successfully." });
  } catch (error) {
    await connection.rollback();
    console.error("Insert error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add student with fees." });
  } finally {
    connection.release();
  }
};

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
