const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialtyController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const appointmentController = require('../controllers/appointmentController');


const initAPIRoutes = (app) => {
    router.get('/specialties', specialtyController.getSpecialties);
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.get('/users', userController.getAllUsers); 

// 2. API Quản lý Lịch hẹn (Mới bổ sung)
    router.get('/appointments', appointmentController.getAllAppointments);
    router.post('/appointments', appointmentController.createAppointment);
    router.put('/appointments/:id/status', appointmentController.updateAppointmentStatus);

    // Tiền tố chung cho tất cả API sẽ là /api/v1
    return app.use('/api/v1', router);
};
const { getDoctors } = require('../controllers/userController');

router.get('/doctors', getDoctors); 

module.exports = initAPIRoutes;