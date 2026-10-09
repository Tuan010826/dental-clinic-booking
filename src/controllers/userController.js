const { pool } = require('../config/connectDB');

const getAllUsers = async (req, res) => {
    try {
        // Lấy role_id từ đường dẫn (nếu có) để lọc. Ví dụ: ?roleId=2
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

module.exports = { getAllUsers };