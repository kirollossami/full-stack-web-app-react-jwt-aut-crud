/* eslint-env node */
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createConnection({
  // eslint-disable-next-line no-undef
  host: process.env.DB_HOST,
  // eslint-disable-next-line no-undef
  user: process.env.DB_USER,
  // eslint-disable-next-line no-undef
  password: process.env.DB_PASSWORD,
  // eslint-disable-next-line no-undef
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to MySQL database");
  }
});

export default db;
