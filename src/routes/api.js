const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialtyController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const appointmentController = require('../controllers/appointmentController');

const initAPIRoutes = (app) => {
    // 1. API Chuyên khoa, Xác thực & Người dùng
    router.get('/specialties', specialtyController.getSpecialties);
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.get('/users', userController.getAllUsers); 
    // 2. API Quản lý Lịch hẹn 
    router.get('/appointments', appointmentController.getAllAppointments);
    router.post('/appointments', appointmentController.createAppointment);
    router.put('/appointments/:id/status', appointmentController.updateAppointmentStatus);
    router.get('/slots', appointmentController.getSlotsStatus);
    router.post('/book-appointment', appointmentController.bookAppointment);
    router.get('/appointments/patient/:patientId', appointmentController.getPatientAppointments);
    // 3. API Bác sĩ (Đã đưa vào trong hàm initAPIRoutes để chạy chuẩn xác)
    router.get('/doctors', userController.getDoctors); 
    router.get('/admin/appointments', appointmentController.getAdminAppointments); 
    router.put('/admin/appointments/:id/status', appointmentController.updateAppointmentStatus); 
    // Tiền tố chung cho tất cả API sẽ là /api/v1
    return app.use('/api/v1', router);
};

module.exports = initAPIRoutes;