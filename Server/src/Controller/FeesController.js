import pool from "../Config/db.js";
export const addFeesHeading = async (req, res) => {
  const { feesHeading, groupName, frequency, accountName, months } = req.body;

  if (!feesHeading || !groupName || !frequency || !accountName || !months) {
    return res.status(400).json({ success: false, error: "Invalid or missing fields" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO fees_headings (feesHeading, groupName, frequency, accountName, months)
       VALUES (?, ?, ?, ?, ?)`,
      [feesHeading, groupName, frequency, accountName, months]
    );
    res.json({ success: true, message: "Fees heading saved", insertedId: result.insertId });
  } catch (err) {
    console.error("Insert error:", err);
    res.status(500).json({ success: false, error: "Failed to save data" });
  }

  
};




export const updateFeesHeading = async (req, res) => {
  const id = req.params.id;
  const { feesHeading, groupName, frequency, accountName, months } = req.body;
  try {
    const sql = `UPDATE fees_headings SET fees_heading=?, groupName=?, frequency=?, accountName=?, months=? WHERE id=?`;
    const values = [feesHeading, groupName, frequency, accountName, months.join(","), id];
    const [result] = await pool.query(sql, values);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteFeesHeading = async (req, res) => {
  const id = req.params.id;
  try {
    const sql = `DELETE FROM fees_headings WHERE id = ?`;
    await pool.query(sql, [id]);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const getAllFeesPlans = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, feesHeading, value, className, category
      FROM fees_plan
      ORDER BY id DESC
    `);

    res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching fee plans:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch fee plans",
      error: err.message,
    });
  }
};
export const getAllFeesHeadings = async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT DISTINCT feesHeading FROM fees_headings`);
    
    // Corrected the property name from row.fees_heading to row.feesHeading
    const headings = rows.map((row) => row.feesHeading);

    res.status(200).json({ success: true, data: headings });
  } catch (err) {
    console.error("Error fetching fees headings:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
export const applyFees = async (req, res) => {
  const { admissionNo, className, category, selectedMonths } = req.body;

  if (
    !admissionNo ||
    !className ||
    !category ||
    !Array.isArray(selectedMonths) ||
    selectedMonths.length === 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Missing or invalid admissionNo, className, category, or selectedMonths",
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // Step 1: Fetch student info
    const [[student]] = await connection.query(
      `SELECT * FROM students WHERE admissionNumber = ?`,
      [admissionNo]
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const studentRoute = student.routeName || student.route || null;
    const feeBreakdown = [];

    // Step 2: Already applied months
    const placeholders = selectedMonths.map(() => "?").join(",");
    const [alreadyApplied] = await connection.query(
      `SELECT DISTINCT months FROM fees_register WHERE admissionNumber = ? AND months IN (${placeholders})`,
      [admissionNo, ...selectedMonths]
    );

    const appliedMonths = alreadyApplied.map((row) => row.months);
    const monthsToApply = selectedMonths.filter(
      (m) => !appliedMonths.includes(m)
    );

    if (monthsToApply.length === 0) {
      return res.status(409).json({
        success: false,
        message: "Fees already applied for all selected months",
        alreadyApplied: appliedMonths,
      });
    }

    // Step 3: Academic Fees
    const [feePlans] = await connection.query(
      `SELECT * FROM fees_plan WHERE className = ? AND category = ?`,
      [className, category]
    );

    if (feePlans.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No academic fee plan found",
      });
    }

    for (const plan of feePlans) {
      for (const month of monthsToApply) {
        feeBreakdown.push({
          feesHeading: plan.feesHeading,
          month,
          originalAmount: Number(plan.value),
          finalAmount: Number(plan.value),
        });
      }
    }

    // Step 4: Transport Fee (if applicable)
    let transportFeePerMonth = 0;

    if (studentRoute) {
      const [routePriceRows] = await connection.query(
        `SELECT price FROM route_plans WHERE class_name = ? AND category_name = ? AND route_name = ?`,
        [className, category, studentRoute]
      );

      const [routeMonthsRows] = await connection.query(
        `SELECT months FROM routes WHERE route_name = ?`,
        [studentRoute]
      );

      if (routePriceRows.length && routeMonthsRows.length) {
        transportFeePerMonth = Number(routePriceRows[0].price || 0);
       
      const monthsStr = routeMonthsRows[0].months || "";
     const validMonths = monthsStr
        .split(",")
         .map((m) => m.trim().toLowerCase())
         .filter(Boolean);

        for (const month of monthsToApply) {
          if (validMonths.includes(month.toLowerCase())) {            feeBreakdown.push({
              feesHeading: "Transport Fee",
              month,
              originalAmount: transportFeePerMonth,
              finalAmount: transportFeePerMonth,
            });
          }
        }
      }
    }

    // Step 5: Insert into fees_register
    for (const month of monthsToApply) {
      const monthItems = feeBreakdown.filter((f) => f.month === month);
      const totalAmount = monthItems.reduce((sum, f) => sum + f.finalAmount, 0);
      const feeHeads = monthItems.map((f) => f.feesHeading).join(", ");

      await connection.query(
        `INSERT INTO fees_register (
          date, rec_no, admissionNumber, roll_no, student_name,
          class, category, route, months, fees, late_fee,
          ledger_amt, discount, total, recd_amt, balance, feesHeading
        ) VALUES (
          CURDATE(), ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 0, ?, 0, ?, ?
        )`,
        [
          `REC-${Date.now()}`,
          admissionNo,
          student.roll_no || null,
          `${student.firstName} ${student.lastName}`.trim(),
          className,
          category,
          studentRoute,
          month,
          totalAmount,
          totalAmount,
          totalAmount,
          totalAmount,
          feeHeads,
        ]
      );
    }

    // Step 6: Remove from student_months
    if (monthsToApply.length > 0) {
      const delPlaceholders = monthsToApply.map(() => "?").join(",");
      await connection.query(
        `DELETE FROM student_months WHERE admissionNo = ? AND month IN (${delPlaceholders})`,
        [admissionNo, ...monthsToApply]
      );
    }

    // Step 7: Totals
    const totalOriginal = feeBreakdown.reduce((sum, f) => sum + f.originalAmount, 0);
    const totalFinal = feeBreakdown.reduce((sum, f) => sum + f.finalAmount, 0);

    res.status(200).json({
      success: true,
      message: "Fees applied successfully",
      data: {
        admissionNo,
        appliedMonths: monthsToApply,
        skippedMonths: appliedMonths,
        breakdown: feeBreakdown,
        totals: {
          original: totalOriginal,
          final: totalFinal,
        },
        routeFee: transportFeePerMonth,
      },
    });
  } catch (err) {
    console.error("❌ TiDB Apply Fees Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  } finally {
    if (connection) connection.release();
  }
};


export const getPendingFees = async (req, res) => {
  const admissionNo =
    req.method === "GET" ? req.query.admissionNo : req.body.admissionNo;

  if (!admissionNo) {
    return res.status(400).json({
      success: false,
      message: "Admission number is required",
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // 1. Get student details
    const [studentRows] = await connection.query(
      "SELECT * FROM students WHERE admissionNumber = ?",
      [admissionNo]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const student = studentRows[0];

    // 2. Get pending months from student_months table
    const [availableMonths] = await connection.query(
      "SELECT month FROM student_months WHERE admissionNo = ? ORDER BY id ASC",
      [admissionNo]
    );

    const remainingMonths = availableMonths.map((m) => m.month);

    // 3. Get fee plans for the student's class & category
    const [feePlans] = await connection.query(
      "SELECT * FROM fees_plan WHERE className = ? AND category = ?",
      [student.class, student.category]
    );

    // 4. Get paid fees (grouped by feesHeading)
    const [paidFeesRows] = await connection.query(
      "SELECT feesHeading, SUM(recd_amt) as paidAmount FROM fees_register WHERE admissionNumber = ? GROUP BY feesHeading",
      [admissionNo]
    );

    const paidFees = paidFeesRows.map((row) => ({
      feesHeading: row.feesHeading,
      paidAmount: Number(row.paidAmount || 0),
    }));

    // 5. Get all paid months
    const [paidMonthsRows] = await connection.query(
      "SELECT DISTINCT months FROM fees_register WHERE admissionNumber = ? AND months IS NOT NULL",
      [admissionNo]
    );

    const allPaidMonths = [];
    paidMonthsRows.forEach((row) => {
      if (row.months) {
        const months = row.months.split(",").map((m) => m.trim());
        allPaidMonths.push(...months);
      }
    });
    const uniquePaidMonths = [...new Set(allPaidMonths)];

    // 6. Prepare pending academic fees
    const pendingFees = feePlans.map((plan) => {
      const paidRecord = paidFees.find((p) => p.feesHeading === plan.feesHeading);
      const paid = paidRecord ? paidRecord.paidAmount : 0;
      const balance = Math.max(Number(plan.value) - paid, 0);

      return {
        feesHeading: plan.feesHeading,
        total: Number(plan.value),
        paid,
        balance,
        months: remainingMonths.length > 0 ? remainingMonths.join(", ") : "No Pending Months",
        paidMonths: uniquePaidMonths,
      };
    });

    // 7. Handle Transport Fee
    if (student.routeName) {
      const [routePlanData] = await connection.query(
        "SELECT price FROM route_plans WHERE class_name = ? AND category_name = ? AND route_name = ?",
        [student.class, student.category, student.routeName]
      );

      if (routePlanData.length > 0) {
        const routePrice = Number(routePlanData[0].price);
        const paidTransport = paidFees.find((p) => p.feesHeading === "Transport Fee");
        const paidAmount = paidTransport ? paidTransport.paidAmount : 0;

        pendingFees.push({
          feesHeading: "Transport Fee",
          total: routePrice * remainingMonths.length,
          paid: paidAmount,
          balance: Math.max(routePrice * remainingMonths.length - paidAmount, 0),
          months: remainingMonths.length > 0 ? remainingMonths.join(", ") : "No Pending Months",
          paidMonths: uniquePaidMonths,
        });
      }
    }

    res.json({
      success: true,
      admissionNo,
      student,
      pendingFees,
      remainingMonths,
      paidMonths: uniquePaidMonths,
    });
  } catch (error) {
    console.error("❌ Error fetching pending fees:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending fees",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};
export const updateFeesPlan = async (req, res) => {
  const { id } = req.params;
  const { feesHeading, value, className, category } = req.body;

  if (!feesHeading || !value || !className || !category) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields for update",
    });
  }

  try {
    const [result] = await pool.query(
      `UPDATE fees_plan SET feesHeading = ?, value = ?, className = ?, category = ? WHERE id = ?`,
      [feesHeading, value, className, category, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Fee plan not found" });
    }

    res.status(200).json({ success: true, message: "Fee plan updated successfully" });
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};
export const deleteFeesPlan = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(`DELETE FROM fees_plan WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Fee plan not found" });
    }

    res.status(200).json({ success: true, message: "Fee plan deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};


export const addFeesPlan = async (req, res) => {
  const { feesHeading, value, classes, categories } = req.body;

  if (!feesHeading || !value || !classes || !categories) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: feesHeading, value, classes, or categories",
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


export const getStudentByAdmission = async (req, res) => {
  const { admissionNo } = req.params;

  try {
    // 1. Fetch student data
    const [studentResult] = await pool.query(
      "SELECT * FROM students WHERE admissionNumber = ?",
      [admissionNo]
    );

    if (studentResult.length === 0) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const student = studentResult[0];

       // 2. Initialize student_months if not exists (for new students)
    const [existingMonths] = await connection.query(
      "SELECT COUNT(*) AS cnt FROM student_months WHERE admissionNo = ?",
      [admissionNo]
    );

    if (existingMonths[0].cnt === 0) {
      // Insert all 12 months for new student
      const allMonths = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
      for (const month of allMonths) {
        await connection.query(
          "INSERT IGNORE INTO student_months (admissionNo, month) VALUES (?, ?)",
          [admissionNo, month]
        );
      }
    }

    // 3. Fetch remaining months
    const [monthsResult] = await connection.query(
      "SELECT month FROM student_months WHERE admissionNo = ? ORDER BY id ASC",
      [admissionNo]
    );

    const months = monthsResult.map(m => m.month);

    // 4. Fetch pending fees from fees_register
    const [pendingResult] = await connection.query(
      "SELECT feesHeading, SUM(balance) as balance, GROUP_CONCAT(month ORDER BY month) as months FROM fees_register WHERE admissionNumber = ? AND balance > 0 GROUP BY feesHeading",
      [admissionNo]
    );

    const pendingFees = pendingResult || [];

    // 5. Return combined data
    res.json({
      success: true,
      student,
      months,
      pendingFees,
    });

  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ success: false, message: "Server error" });
  } finally {
    if (connection) connection.release();
  }

};
export const getAllFeesRecords = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM fees_register ORDER BY id DESC");

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch fees records",
      error: error.message,
    });
  }
};

export const fees_Register = async (req, res) => {
  const {
    date,
    rec_no,
    admissionNumber,
    student_name,
    className,
    category,
    routeName,
    months,
    fees,
    total,
    recd_amt,
    balance,
    feesHeading,
    late_fee = 0,
    discount = 0
  } = req.body;

  // Validate required fields
  if (!admissionNumber || !recd_amt || !date || !rec_no) {
    return res.status(400).json({
      success: false,
      message: "Admission number, receipt number, date, and amount are required",
    });
  }

  if (!months || months.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Months field is required",
    });
  }

  let connection;
  try {
    connection = await pool.getConnection();

    // STEP 1: Get student details if not provided
    let studentData = student_name;
    if (!student_name) {
      const [[student]] = await connection.query(
        "SELECT firstName, lastName FROM students WHERE admissionNumber = ?",
        [admissionNumber]
      );
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }
      studentData = `${student.firstName} ${student.lastName}`;
    }

    // STEP 2: Calculate total if not provided
    let totalAmount = total || fees + late_fee - discount;
    let balanceAmount = balance || totalAmount - recd_amt;

    // STEP 3: Insert into fees_register table
    const insertQuery = `
      INSERT INTO fees_register 
      (date, rec_no, admissionNumber, student_name, class, category, route, months, fees, late_fee, ledger_amt, discount, total, recd_amt, balance, feesHeading) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.query(insertQuery, [
      date,
      rec_no,
      admissionNumber,
      studentData,
      className,
      category,
      routeName,
      months,
      fees,
      late_fee,
      totalAmount,  // ledger_amt
      discount,
      totalAmount,
      recd_amt,
      balanceAmount,
      feesHeading,
    ]);

    res.status(201).json({
      success: true,
      message: "Fees recorded successfully",
      data: {
        admissionNumber,
        student_name: studentData,
        months,
        totalAmount,
        recd_amt,
        balanceAmount,
      },
    });
  } catch (error) {
    console.error("❌ Error recording fees:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to record fees",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};
