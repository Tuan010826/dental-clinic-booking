const { pool: db } = require('../config/connectDB');

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
const getDoctorsList = async (req, res) => {
    try {
        const [doctors] = await db.execute(`
            SELECT d.id, u.full_name FROM doctors d 
            JOIN users u ON d.user_id = u.id
        `);
        return res.json(doctors);
    } catch (error) {
        console.error("Lỗi lấy danh sách bác sĩ:", error);
        return res.status(500).json({ message: "Lỗi lấy danh sách bác sĩ" });
    }
};

// API 2: Lấy trạng thái các slot giờ (Check trống / kín ca)
const getSlotsStatus = async (req, res) => {
    const { date, doctor_id } = req.query;
    const timeSlots = [
        '08:00 - 08:30', '08:30 - 09:00', '09:00 - 09:30', '09:30 - 10:00',
        '14:00 - 14:30', '14:30 - 15:00', '17:00 - 17:30', '18:00 - 18:30'
    ];

    try {
        const [doctors] = await db.execute('SELECT id FROM doctors');
        let resultSlots = [];

        for (let time of timeSlots) {
            let isFull = false;

            if (doctor_id && doctor_id !== '') {
                const [booked] = await db.execute(`
                    SELECT a.* FROM appointments a 
                    JOIN schedules s ON a.schedule_id = s.id 
                    WHERE s.date = ? AND s.time_type = ? AND s.doctor_id = ? AND a.status != 'Hủy'
                `, [date, time, doctor_id]);
                if (booked.length > 0) isFull = true;
            } else {
                let bookedCount = 0;
                for (let doc of doctors) {
                    const [booked] = await db.execute(`
                        SELECT a.* FROM appointments a 
                        JOIN schedules s ON a.schedule_id = s.id 
                        WHERE s.date = ? AND s.time_type = ? AND s.doctor_id = ? AND a.status != 'Hủy'
                    `, [date, time, doc.id]);
                    if (booked.length > 0) bookedCount++;
                }
                if (bookedCount >= doctors.length && doctors.length > 0) {
                    isFull = true;
                }
            }

            resultSlots.push({ time, status: isFull ? 'full' : 'available' });
        }
        return res.json(resultSlots);
    } catch (error) {
        console.error("Lỗi lấy slots:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};

// API 3: Xử lý Đặt lịch hẹn
// API 3: Xử lý Đặt lịch hẹn (Đã tích hợp kiểm tra lịch bác sĩ + chống trùng lặp người dùng)
const bookAppointment = async (req, res) => {
    const { clinic, service, doctor_id, date, timeSlot, fullName, gender, dob, phone, email, reason } = req.body;

    try {
        const [doctors] = await db.execute('SELECT id FROM doctors');
        let assignedDoctorId = doctor_id;

        // 1. CHỨC NĂNG CỐT LÕI: Kiểm tra lịch bác sĩ đã bị đặt chưa
        if (doctor_id && doctor_id !== '') {
            const [existing] = await db.execute(`
                SELECT a.* FROM appointments a 
                JOIN schedules s ON a.schedule_id = s.id 
                WHERE s.date = ? AND s.time_type = ? AND s.doctor_id = ? AND a.status != 'Hủy'
            `, [date, timeSlot, doctor_id]);

            if (existing.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Bác sĩ đã chọn đã có lịch hẹn vào ca ${timeSlot} ngày ${date}. Vui lòng chọn ca hoặc ngày khác!` 
                });
            }
        } else {
            // Tự động tìm bác sĩ còn trống ca
            let foundDocId = null;
            for (let doc of doctors) {
                const [booked] = await db.execute(`
                    SELECT a.* FROM appointments a 
                    JOIN schedules s ON a.schedule_id = s.id 
                    WHERE s.date = ? AND s.time_type = ? AND s.doctor_id = ? AND a.status != 'Hủy'
                `, [date, timeSlot, doc.id]);

                if (booked.length === 0) {
                    foundDocId = doc.id;
                    break;
                }
            }

            if (!foundDocId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Tất cả các bác sĩ đều đã kín lịch vào ca này. Vui lòng chọn ngày khác (thông tin đăng ký của bạn vẫn được giữ nguyên)!' 
                });
            }
            assignedDoctorId = foundDocId;
        }

        // 2. XỬ LÝ THÔNG TIN BỆNH NHÂN (Tránh tạo trùng lặp dòng trong bảng users và tránh lỗi NOT NULL)
        let patientId = null;
        let userExist = [];

        if (phone) {
            const [rows] = await db.execute('SELECT id FROM users WHERE phone = ?', [phone]);
            userExist = rows;
        }

        const dbGender = gender === 'Nam' ? 'MALE' : (gender === 'Nữ' ? 'FEMALE' : 'OTHER');
        const patientEmail = (email && email.trim() !== '') ? email : `${phone || 'guest'}@patient.temp`;

        if (userExist.length > 0) {
            // Nếu số điện thoại này đã tồn tại trong hệ thống -> Tận dụng ID cũ, cập nhật lại tên/giới tính mới nhất
            patientId = userExist[0].id;
            await db.execute(
                'UPDATE users SET full_name = ?, gender = ?, email = ? WHERE id = ?',
                [fullName, dbGender, patientEmail, patientId]
            );
        } else {
            // Nếu chưa có -> Tạo mới 1 dòng duy nhất trong bảng users (với password rỗng để vượt qua ràng buộc CSDL)
            const [newUser] = await db.execute(
                'INSERT INTO users (role_id, email, password, full_name, phone, gender) VALUES (1, ?, ?, ?, ?, ?)',
                [patientEmail, '', fullName, phone || '', dbGender]
            );
            patientId = newUser.insertId;
        }

        // 3. Tạo hoặc lấy schedule_id (Lưu vào bảng schedules)
        const scheduleId = await getOrCreateScheduleId(date, timeSlot, assignedDoctorId);

        // 4. Lưu thông tin đặt lịch vào bảng appointments
        await db.execute(`
            INSERT INTO appointments (patient_id, doctor_id, schedule_id, status, reason) 
            VALUES (?, ?, ?, 'PENDING', ?)
        `, [patientId, assignedDoctorId, scheduleId, reason || service]);

        return res.status(200).json({ 
            success: true, 
            message: 'Đặt lịch thành công! Phòng khám sẽ liên hệ lại với bạn để xác nhận.' 
        });

    } catch (error) {
        console.error("Lỗi đặt lịch:", error);
        return res.status(500).json({ success: false, message: 'Lỗi máy chủ nội bộ.' });
    }
};

async function getOrCreateScheduleId(date, time_type, doctor_id) {
    const [rows] = await db.execute(
        'SELECT id FROM schedules WHERE date = ? AND time_type = ? AND doctor_id = ?',
        [date, time_type, doctor_id]
    );
    if (rows.length > 0) {
        return rows[0].id;
    } else {
        const [result] = await db.execute(
            'INSERT INTO schedules (doctor_id, date, time_type, max_booking) VALUES (?, ?, ?, 1)',
            [doctor_id, date, time_type]
        );
        return result.insertId;
    }
}
// 1. API Lấy danh sách lịch hẹn (Có tìm kiếm theo Tên, SĐT, Mã lịch hẹn)
const getAdminAppointments = async (req, res) => {
    const { search } = req.query;

    try {
        let query = `
            SELECT 
                a.id AS appointment_id,
                u.full_name AS patient_name,
                u.phone AS patient_phone,
                s.date AS appointment_date,
                s.time_type AS appointment_time,
                d_user.full_name AS doctor_name,
                a.reason,
                a.status,
                mr.diagnosis,
                mr.prescription
            FROM appointments a
            JOIN users u ON a.patient_id = u.id
            JOIN schedules s ON a.schedule_id = s.id
            JOIN doctors doc ON a.doctor_id = doc.id
            JOIN users d_user ON doc.user_id = d_user.id
            LEFT JOIN medical_records mr ON a.id = mr.appointment_id
        `;
        let params = [];

        if (search && search.trim() !== '') {
            query += ` WHERE a.id = ? OR u.phone LIKE ? OR u.full_name LIKE ?`;
            const pattern = `%${search.trim()}%`;
            params = [search.trim(), pattern, pattern];
        }

        query += ` ORDER BY s.date DESC, s.time_type DESC`;

        const [rows] = await db.execute(query, params);
        console.log("KẾT QUẢ TỪ DATABASE:", rows);
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Lỗi lấy danh sách Admin:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// 2. API Đổi trạng thái Lịch hẹn (Xác nhận / Hủy / Hoàn thành)


module.exports = {
    getAllAppointments,
    updateAppointmentStatus,
    createAppointment,
    getDoctorsList,
    bookAppointment,
    getSlotsStatus,
    getOrCreateScheduleId,
    getAdminAppointments,
};