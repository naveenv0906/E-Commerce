const express = require('express');
const authController = require('../controllers/authControllerCustomer');

const router = express.Router();

// Customer Registration
router.post('/customer-register', authController.register);

// Customer Login
router.post('/customer-login', authController.login);

// Customer Logout
router.post('/customer-logout', authController.logout);

// Request Password Reset
router.post('/customer-reset', authController.requestPasswordReset);

// Reset Password
router.post('/customer-reset/:token', authController.resetPassword);

module.exports = router;
