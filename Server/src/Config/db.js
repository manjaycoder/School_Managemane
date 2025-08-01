import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.host ||"gateway01.us-west-2.prod.aws.tidbcloud.com",
  user:process.env.user|| "2GLj2DM8w2T5dsY.root",
  password:process.env.password|| "8OdgTDUI2PLROBVz",
  database: process.env.database||"school_db",
  port: 4000,
  ssl: {
    rejectUnauthorized: true,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL Connected");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
    process.exit(1);
  }
})();

export default pool;
