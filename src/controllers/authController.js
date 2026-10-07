const { pool } = require('../config/connectDB');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
    try {
        const { email, password, full_name, phone } = req.body;

        // 1. Kiểm tra xem email đã tồn tại trong database chưa
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email này đã được sử dụng!' });
        }

        // 2. Mã hóa mật khẩu để bảo mật (không lưu mật khẩu gốc)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Lưu user mới vào database (role_id mặc định là 3 - Bệnh nhân)
        const [result] = await pool.query(
            'INSERT INTO users (email, password, full_name, phone, role_id) VALUES (?, ?, ?, ?, ?)',
            [email, hashedPassword, full_name, phone, 3]
        );

        return res.status(201).json({
            message: 'Đăng ký tài khoản thành công!',
            userId: result.insertId
        });
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Kiểm tra xem email có tồn tại trong Database không
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Email không tồn tại hoặc chưa đăng ký!' });
        }

        const user = users[0];

        // 2. Dùng bcrypt để so sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Sai mật khẩu!' });
        }

        // 3. Đăng nhập thành công -> Trả về thông tin cơ bản (Không dùng JWT)
        return res.status(200).json({
            message: 'Đăng nhập thành công!',
            data: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role_id: user.role_id // Cột này cực kỳ quan trọng để Frontend phân quyền
            }
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        return res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = { register, login };
