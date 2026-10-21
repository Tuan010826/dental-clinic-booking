const { pool } = require('../config/connectDB');

const getSpecialties = async (req, res) => {
    try {
        // Query lấy toàn bộ dữ liệu từ bảng specialties
        const [rows, fields] = await pool.query('SELECT * FROM specialties');
        
        return res.status(200).json({
            message: 'Lấy danh sách chuyên khoa thành công',
            data: rows
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};

module.exports = {
    getSpecialties
};