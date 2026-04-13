// config/database.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'courses_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Перевірка з'єднання
pool.getConnection()
  .then(conn => {
    console.log('MySQL connected');
    conn.release();
  })
  .catch(err => console.error('MySQL error:', err.message));

module.exports = pool;