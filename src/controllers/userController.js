const { pool } = require('../config/connectDB');

const getAllUsers = async (req, res) => {
    try {
        const roleId = req.query.roleId; 
        
        let query = 'SELECT id, email, full_name, phone, role_id FROM users';
        let queryParams = [];

        if (roleId) {
            query += ' WHERE role_id = ?';
            queryParams.push(roleId);
        }

        const [users] = await pool.query(query, queryParams);

        return res.status(200).json({
            message: 'Lấy danh sách người dùng thành công',
            data: users
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách user:", error);
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Hàm lấy danh sách Bác sĩ từ 3 bảng (Đã sửa lại dùng pool.query và async/await)
const getDoctors = async (req, res) => {
    try {
        const sql = `
            SELECT 
                d.id,
                d.position,
                d.price,
                d.description,
                u.full_name,
                u.email,
                u.phone,
                u.avatar,
                s.name AS specialty_name
            FROM doctors d
            JOIN users u ON d.user_id = u.id
            LEFT JOIN specialties s ON d.specialty_id = s.id
        `;

        // Dùng chuẩn await pool.query giống hệt như hàm getAllUsers bên trên
        const [results] = await pool.query(sql);

        return res.status(200).json({ 
            success: true, 
            data: results 
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách bác sĩ:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getAllUsers, getDoctors };