const mysql = require('mysql2/promise');
require('dotenv').config();

// Tạo hồ chứa kết nối (Pool)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Hàm test kết nối
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Kết nối thành công với MySQL Database: dental_clinic_db!');
        connection.release();
    } catch (error) {
        console.error('Lỗi kết nối Database:', error.message);
    }
};

module.exports = { pool, testConnection };