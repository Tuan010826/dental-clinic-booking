const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialtyController');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Khởi tạo các API routes
const initAPIRoutes = (app) => {
    router.get('/specialties', specialtyController.getSpecialties);
    router.post('/register', authController.register);
    router.post('/login', authController.login);
    router.get('/users', userController.getAllUsers);
    // Tiền tố chung cho tất cả API sẽ là /api/v1
    return app.use('/api/v1', router);
};

module.exports = initAPIRoutes;