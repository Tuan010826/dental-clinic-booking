const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialtyController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const appointmentController = require('../controllers/appointmentController');
// Khởi tạo các API routes
const initAPIRoutes = (app) => {
    router.get('/specialties', specialtyController.getSpecialties);
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.get('/users', userController.getAllUsers);
    router.get('/doctors', appointmentController.getDoctorsList);
    router.get('/slots', appointmentController.getSlotsStatus);
    router.post('/book-appointment', appointmentController.bookAppointment);
    // === BỔ SUNG ROUTE QUẢN LÝ LỊCH HẸN CHO ADMIN ===
    router.get('/admin/appointments', appointmentController.getAdminAppointments); 
    // Hoặc tên hàm lấy danh sách tương ứng trong controller của bạn
    router.put('/admin/appointments/:id/status', appointmentController.updateAppointmentStatus); 
    // Hoặc tên hàm đổi trạng thái
    // Tiền tố chung cho tất cả API sẽ là /api/v1
    return app.use('/api/v1', router);
};

module.exports = initAPIRoutes;