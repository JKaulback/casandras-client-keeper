const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAppointmentStats
} = require('../controllers/statsController');

// Dashboard statistics
router.get('/dashboard', getDashboardStats);

// Appointment-specific statistics
router.get('/appointments', getAppointmentStats);

module.exports = router;
