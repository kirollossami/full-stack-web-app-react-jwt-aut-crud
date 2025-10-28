/* eslint-disable no-undef */
// config/db.js
import mysql from 'mysql2/promise';
import 'dotenv/config';

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const testConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('Connected to MySQL database');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    return false;
  }
};

export default db;