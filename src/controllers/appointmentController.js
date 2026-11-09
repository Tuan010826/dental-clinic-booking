const { pool: db } = require('../config/connectDB');

// 1. API Lấy danh sách toàn bộ lịch hẹn (Admin / Bác sĩ)
const getAllAppointments = async (req, res) => {
    try {
        const { status, doctorId, date } = req.query;
        let sql = `
            SELECT 
                a.id, a.patient_id, a.doctor_id, a.schedule_id, a.status, a.reason, a.created_at,
                u_patient.full_name AS patient_name, u_patient.phone AS patient_phone, u_patient.email AS patient_email,
                CONCAT(IFNULL(d.position, 'BS.'), ' ', u_doctor.full_name) AS doctor_name,
                DATE_FORMAT(s.date, '%Y-%m-%d') AS date, s.time_type
            FROM appointments a
            JOIN users u_patient ON a.patient_id = u_patient.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users u_doctor ON d.user_id = u_doctor.id
            JOIN schedules s ON a.schedule_id = s.id
            WHERE 1=1
        `;
        const params = [];

        if (status && status !== 'ALL') { sql += ' AND a.status = ?'; params.push(status); }
        if (doctorId) { sql += ' AND a.doctor_id = ?'; params.push(doctorId); }
        if (date) { sql += ' AND s.date = ?'; params.push(date); }

        sql += ' ORDER BY s.date DESC, a.created_at DESC';

        const [rows] = await db.execute(sql, params);
        return res.status(200).json({ success: true, message: 'Thành công', data: rows });
    } catch (error) {
        console.error("Lỗi lấy danh sách lịch hẹn:", error);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// 2. API Cập nhật trạng thái lịch hẹn
const updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Trạng thái không hợp lệ!' });
        }

        const [result] = await db.execute('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy lịch hẹn!' });
        }
        return res.status(200).json({ success: true, message: 'Cập nhật thành công!', data: { id: Number(id), status } });
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// 3. API Tạo lịch hẹn mới (Tạo bởi Admin/Lễ tân)
const createAppointment = async (req, res) => {
    try {
        const { patient_id, doctor_id, date, time_type, reason } = req.body;
        if (!patient_id || !doctor_id || !date || !time_type) {
            return res.status(400).json({ success: false, message: 'Điền đủ thông tin!' });
        }

        let [schedules] = await db.execute('SELECT id, max_booking FROM schedules WHERE doctor_id = ? AND date = ? AND time_type = ?', [doctor_id, date, time_type]);
        let schedule_id;

        if (schedules.length === 0) {
            const [newSched] = await db.execute('INSERT INTO schedules (doctor_id, date, time_type, max_booking) VALUES (?, ?, ?, 1)', [doctor_id, date, time_type]);
            schedule_id = newSched.insertId;
        } else {
            schedule_id = schedules[0].id;
            const [existingBookings] = await db.execute("SELECT id FROM appointments WHERE schedule_id = ? AND status != 'CANCELLED'", [schedule_id]);
            if (existingBookings.length >= schedules[0].max_booking) {
                return res.status(409).json({ success: false, message: 'Khung giờ này đã kín lịch!' });
            }
        }

        const [result] = await db.execute(
            'INSERT INTO appointments (patient_id, doctor_id, schedule_id, status, reason) VALUES (?, ?, ?, ?, ?)',
            [patient_id, doctor_id, schedule_id, 'PENDING', reason || 'Khám nha khoa']
        );
        return res.status(201).json({ success: true, message: 'Thành công!', appointmentId: result.insertId });
    } catch (error) {
        console.error("Lỗi tạo lịch hẹn:", error);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};

// 4. API Lấy danh sách bác sĩ
const getDoctorsList = async (req, res) => {
    try {
        const [doctors] = await db.execute(`SELECT d.id, u.full_name FROM doctors d JOIN users u ON d.user_id = u.id`);
        return res.json(doctors);
    } catch (error) {
        console.error("Lỗi lấy danh sách bác sĩ:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};

// 5. API Kiểm tra trạng thái Slot giờ khám
const getSlotsStatus = async (req, res) => {
    const { date, doctor_id } = req.query;
    const timeSlots = ['08:00 - 08:30', '08:30 - 09:00', '09:00 - 09:30', '09:30 - 10:00', '14:00 - 14:30', '14:30 - 15:00', '17:00 - 17:30', '18:00 - 18:30'];

    try {
        const [doctors] = await db.execute('SELECT id FROM doctors');
        let resultSlots = [];

        for (let time of timeSlots) {
            let isFull = false;
            if (doctor_id && doctor_id !== '') {
                const [booked] = await db.execute(`
                    SELECT a.* FROM appointments a JOIN schedules s ON a.schedule_id = s.id 
                    WHERE s.date = ? AND s.time_type = ? AND s.doctor_id = ? AND a.status != 'Hủy'
                `, [date, time, doctor_id]);
                if (booked.length > 0) isFull = true;
            } else {
                let bookedCount = 0;
                for (let doc of doctors) {
                    const [booked] = await db.execute(`
                        SELECT a.* FROM appointments a JOIN schedules s ON a.schedule_id = s.id 
                        WHERE s.date = ? AND s.time_type = ? AND s.doctor_id = ? AND a.status != 'Hủy'
                    `, [date, time, doc.id]);
                    if (booked.length > 0) bookedCount++;
                }
                if (bookedCount >= doctors.length && doctors.length > 0) isFull = true;
            }
            resultSlots.push({ time, status: isFull ? 'full' : 'available' });
        }
        return res.json(resultSlots);
    } catch (error) {
        console.error("Lỗi lấy slots:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};

// 6. API Xử lý Form đặt lịch khách hàng (Đã sửa Bug role_id)
const bookAppointment = async (req, res) => {
    const { clinic, service, doctor_id, date, timeSlot, fullName, gender, dob, phone, email, reason } = req.body;

    try {
        const [doctors] = await db.execute('SELECT id FROM doctors');
        let assignedDoctorId = doctor_id;

        if (doctor_id && doctor_id !== '') {
            const [existing] = await db.execute(`
                SELECT a.* FROM appointments a JOIN schedules s ON a.schedule_id = s.id 
                WHERE s.date = ? AND s.time_type = ? AND s.doctor_id = ? AND a.status != 'Hủy'
            `, [date, timeSlot, doctor_id]);

            if (existing.length > 0) return res.status(400).json({ success: false, message: 'Ca khám này đã kín!' });
        } else {
            let foundDocId = null;
            for (let doc of doctors) {
                const [booked] = await db.execute(`
                    SELECT a.* FROM appointments a JOIN schedules s ON a.schedule_id = s.id 
                    WHERE s.date = ? AND s.time_type = ? AND s.doctor_id = ? AND a.status != 'Hủy'
                `, [date, timeSlot, doc.id]);
                if (booked.length === 0) { foundDocId = doc.id; break; }
            }
            if (!foundDocId) return res.status(400).json({ success: false, message: 'Tất cả bác sĩ đã kín lịch!' });
            assignedDoctorId = foundDocId;
        }

        let patientId = null;
        let userExist = [];
        if (phone) {
            const [rows] = await db.execute('SELECT id FROM users WHERE phone = ?', [phone]);
            userExist = rows;
        }

        const dbGender = gender === 'Nam' ? 'MALE' : (gender === 'Nữ' ? 'FEMALE' : 'OTHER');
        const patientEmail = (email && email.trim() !== '') ? email : `${phone || 'guest'}@patient.temp`;

        if (userExist.length > 0) {
            patientId = userExist[0].id;
            await db.execute('UPDATE users SET full_name = ?, gender = ?, email = ? WHERE id = ?', [fullName, dbGender, patientEmail, patientId]);
        } else {
            // ĐÃ FIX: Chuyển role_id từ 1 (Admin) sang 3 (Patient)
            const [newUser] = await db.execute(
                'INSERT INTO users (role_id, email, password, full_name, phone, gender) VALUES (3, ?, ?, ?, ?, ?)',
                [patientEmail, '', fullName, phone || '', dbGender]
            );
            patientId = newUser.insertId;
        }

        const scheduleId = await getOrCreateScheduleId(date, timeSlot, assignedDoctorId);
        await db.execute(`
            INSERT INTO appointments (patient_id, doctor_id, schedule_id, status, reason) 
            VALUES (?, ?, ?, 'PENDING', ?)
        `, [patientId, assignedDoctorId, scheduleId, reason || service]);

        return res.status(200).json({ success: true, message: 'Đặt lịch thành công!' });
    } catch (error) {
        console.error("Lỗi đặt lịch:", error);
        return res.status(500).json({ success: false, message: 'Lỗi server.' });
    }
};

// 7. Hàm Helper lấy hoặc tạo Schedule
async function getOrCreateScheduleId(date, time_type, doctor_id) {
    const [rows] = await db.execute('SELECT id FROM schedules WHERE date = ? AND time_type = ? AND doctor_id = ?', [date, time_type, doctor_id]);
    if (rows.length > 0) return rows[0].id;
    
    const [result] = await db.execute('INSERT INTO schedules (doctor_id, date, time_type, max_booking) VALUES (?, ?, ?, 1)', [doctor_id, date, time_type]);
    return result.insertId;
}

// 8. API Admin Search
const getAdminAppointments = async (req, res) => {
    const { search } = req.query;
    try {
        let query = `
            SELECT a.id AS appointment_id, u.full_name AS patient_name, u.phone AS patient_phone,
                   s.date AS appointment_date, s.time_type AS appointment_time, d_user.full_name AS doctor_name,
                   a.reason, a.status, mr.diagnosis, mr.prescription
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
        return res.status(200).json({ success: true, data: rows });
    } catch (error) {
        console.error("Lỗi lấy danh sách Admin:", error);
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};

// XUẤT RA TOÀN BỘ CÁC HÀM ĐỂ ROUTES GỌI
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