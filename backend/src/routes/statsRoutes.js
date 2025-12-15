const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Dashboard statistics
router.get('/dashboard', statsController.getDashboardStats);

// Appointment-specific statistics
router.get('/appointments', statsController.getAppointmentStats);

module.exports = router;
