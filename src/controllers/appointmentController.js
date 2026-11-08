const { pool } = require('../config/connectDB');

// 1. API Lấy danh sách toàn bộ lịch hẹn (Dành cho Admin / Bác sĩ / Lễ tân)
const getAllAppointments = async (req, res) => {
    try {
        const { status, doctorId, date } = req.query;

        // JOIN 4 bảng: appointments + users (bệnh nhân) + doctors + users (bác sĩ) + schedules
        let sql = `
            SELECT 
                a.id,
                a.patient_id,
                a.doctor_id,
                a.schedule_id,
                a.status,
                a.reason,
                a.created_at,
                u_patient.full_name AS patient_name,
                u_patient.phone AS patient_phone,
                u_patient.email AS patient_email,
                CONCAT(IFNULL(d.position, 'BS.'), ' ', u_doctor.full_name) AS doctor_name,
                DATE_FORMAT(s.date, '%Y-%m-%d') AS date,
                s.time_type
            FROM appointments a
            JOIN users u_patient ON a.patient_id = u_patient.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users u_doctor ON d.user_id = u_doctor.id
            JOIN schedules s ON a.schedule_id = s.id
            WHERE 1=1
        `;
        const params = [];

        // Hỗ trợ lọc theo trạng thái, bác sĩ hoặc ngày khám nếu Frontend truyền lên
        if (status && status !== 'ALL') {
            sql += ' AND a.status = ?';
            params.push(status);
        }
        if (doctorId) {
            sql += ' AND a.doctor_id = ?';
            params.push(doctorId);
        }
        if (date) {
            sql += ' AND s.date = ?';
            params.push(date);
        }

        sql += ' ORDER BY s.date DESC, a.created_at DESC';

        const [rows] = await pool.query(sql, params);

        return res.status(200).json({
            success: true,
            message: 'Lấy danh sách lịch hẹn thành công',
            data: rows
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách lịch hẹn:", error);
        return res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// 2. API Cập nhật trạng thái lịch hẹn (Duyệt / Hoàn thành / Hủy lịch)
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Kiểm tra đúng 4 trạng thái chuẩn trong bảng appointments của database.sql
        const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ! Chỉ chấp nhận: PENDING, CONFIRMED, COMPLETED, CANCELLED'
            });
        }

        const [result] = await pool.query(
            'UPDATE appointments SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch hẹn này trong hệ thống!'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái lịch hẹn thành công!',
            data: { id: Number(id), status }
        });
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái lịch hẹn:", error);
        return res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

// 3. API Tạo lịch hẹn mới (Hỗ trợ luôn cho Thành viên 2 làm Form Đặt lịch & Check trùng lịch)
const createAppointment = async (req, res) => {
    try {
        const { patient_id, doctor_id, date, time_type, reason } = req.body;

        if (!patient_id || !doctor_id || !date || !time_type) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin đặt lịch!'
            });
        }

        // BƯỚC A: Kiểm tra hoặc tự động tạo khung giờ (schedule) cho bác sĩ trong bảng schedules
        let [schedules] = await pool.query(
            'SELECT id, max_booking FROM schedules WHERE doctor_id = ? AND date = ? AND time_type = ?',
            [doctor_id, date, time_type]
        );

        let schedule_id;
        if (schedules.length === 0) {
            const [newSched] = await pool.query(
                'INSERT INTO schedules (doctor_id, date, time_type, max_booking) VALUES (?, ?, ?, 1)',
                [doctor_id, date, time_type]
            );
            schedule_id = newSched.insertId;
        } else {
            schedule_id = schedules[0].id;
            // BƯỚC B: Check trùng lịch (Overbooking) - Nếu khung giờ này đã có người đặt (chưa hủy) thì chặn lại
            const [existingBookings] = await pool.query(
                "SELECT id FROM appointments WHERE schedule_id = ? AND status != 'CANCELLED'",
                [schedule_id]
            );
            if (existingBookings.length >= schedules[0].max_booking) {
                return res.status(409).json({
                    success: false,
                    message: 'Khung giờ này của bác sĩ đã kín lịch, vui lòng chọn khung giờ khác!'
                });
            }
        }

        // BƯỚC C: Lưu lịch hẹn mới vào bảng appointments với trạng thái mặc định là PENDING
        const [result] = await pool.query(
            'INSERT INTO appointments (patient_id, doctor_id, schedule_id, status, reason) VALUES (?, ?, ?, ?, ?)',
            [patient_id, doctor_id, schedule_id, 'PENDING', reason || 'Khám nha khoa tổng quát']
        );

        return res.status(201).json({
            success: true,
            message: 'Đặt lịch khám thành công! Vui lòng chờ phòng khám xác nhận.',
            appointmentId: result.insertId
        });
    } catch (error) {
        console.error("Lỗi tạo lịch hẹn:", error);
        return res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    getAllAppointments,
    updateAppointmentStatus,
    createAppointment
};