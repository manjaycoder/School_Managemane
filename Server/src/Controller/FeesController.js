import pool from "../Config/db.js";
export const addFeesHeading = async (req, res) => {
  const { feesHeading, groupName, frequency, accountName, months } = req.body;

  if (!feesHeading || !groupName || !frequency || !accountName || !Array.isArray(months)) {
    return res.status(400).json({ success: false, error: "Invalid or missing fields" });
  }

  try {
    const sql = `
      INSERT INTO fees_headings (feesHeading, groupName, frequency, accountName, months)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [feesHeading, groupName, frequency, accountName, months.join(",")];

    const [result] = await pool.query(sql, values);

    res.status(200).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("❌ MySQL Insert Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const applyFees = async (req, res) => {
  const { admissionNo, className, category, selectedMonths } = req.body;

  if (!admissionNo || !className || !category || !Array.isArray(selectedMonths)) {
    return res.status(400).json({
      success: false,
      message: "Missing or invalid admissionNo, className, category, or selectedMonths",
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Validate class existence
    const [classRows] = await connection.query(
      "SELECT * FROM class WHERE name = ?",
      [className]
    );
    if (classRows.length === 0) {
      return res.status(404).json({ success: false, message: "Class not found" });
    }

    // 2. Fetch all relevant fee plans
    const [feePlans] = await connection.query(
      "SELECT * FROM fees_plan WHERE className = ? AND category = ?",
      [className, category]
    );
    if (feePlans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No fee plan found for class and category"
      });
    }

    const feeBreakdown = [];
    const allMonthsSet = new Set();

    for (const plan of feePlans) {
      // 3. Get fees heading associated with the plan
      const [headingRows] = await connection.query(
        "SELECT * FROM fees_headings WHERE feesHeading = ?",
        [plan.feesHeading]
      );

      if (headingRows.length > 0) {
        const heading = headingRows[0];

        // Gather all months for unselected calculation later
        const originalMonths = heading.months?.split(',').map(m => m.trim()) || [];
        originalMonths.forEach(m => allMonthsSet.add(m));

        // Compute unselected months
        const unselectedMonths = originalMonths.filter(
          (month) => !selectedMonths.includes(month)
        );

        // 4. Update fees_headings with unselected months
        await connection.query(
          "UPDATE fees_headings SET months = ? WHERE id = ?",
          [unselectedMonths.join(','), heading.id]
        );
      }

      // 5. Create fee breakdown for selected months
      for (const month of selectedMonths) {
        const originalAmount = Number(plan.value);
        feeBreakdown.push({
          feesHeading: plan.feesHeading,
          month,
          originalAmount,
          finalAmount: originalAmount,
        });
      }
    }

    // 6. Calculate unselected months across all fee headings
    const allOriginalMonths = Array.from(allMonthsSet);
    const unselectedMonthsForStudent = allOriginalMonths.filter(
      (month) => !selectedMonths.includes(month)
    );

    // 7. Update student record with unselected months
    await connection.query(
      "UPDATE students SET months = ? WHERE admissionNumber = ?",
      [unselectedMonthsForStudent.join(','), admissionNo]
    );

    // 8. Calculate totals
    const totalOriginal = feeBreakdown.reduce((sum, item) => sum + item.originalAmount, 0);
    const totalFinal = feeBreakdown.reduce((sum, item) => sum + item.finalAmount, 0);

    res.status(200).json({
      success: true,
      message: "Fees applied and unselected months updated successfully",
      data: {
        admissionNo,
        className,
        category,
        appliedMonths: selectedMonths,
        unselectedMonths: unselectedMonthsForStudent,
        breakdown: feeBreakdown,
        totals: {
          original: totalOriginal,
          final: totalFinal,
        },
      },
    });
  } catch (err) {
    console.error("❌ Error applying fees:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  } finally {
    if (connection) connection.release();
  }
};


export const addFeesPlan = async (req, res) => {
  const { feesHeading, value, classes, categories } = req.body;

  if (!feesHeading || !value || !classes || !categories) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: feesHeading, value, classes, or categories",
    });
  }

  if (!Array.isArray(classes) || !Array.isArray(categories)) {
    return res.status(400).json({
      success: false,
      message: "Classes and categories must be arrays",
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const sql = `
      INSERT INTO fees_plan (feesHeading, value, className, category)
      VALUES (?, ?, ?, ?)
    `;

    for (const cls of classes) {
      for (const cat of categories) {
        await connection.execute(sql, [feesHeading, value, cls, cat]);
      }
    }

    await connection.commit();
    res.status(200).json({ success: true, message: "Fee plan saved" });
  } catch (err) {
    if (connection) await connection.rollback();
    console.error("Error saving fee plan:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

// GET /api/student/:admissionNumber
export const getStudentByAdmission = async (req, res) => {
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

    const months = [
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

    res.json({
      success: true,
      student: rows[0],
      months,
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

