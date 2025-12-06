const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByCustomer,
  getAppointmentsByDog,
  getAppointmentsByDateRange,
  getAppointmentsByStatus,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  cancelAppointment
} = require('../controllers/appointmentController');

// Special routes (must be before /:id to avoid conflicts)
router.get('/range', getAppointmentsByDateRange);
router.get('/customer/:customerId', getAppointmentsByCustomer);
router.get('/dog/:dogId', getAppointmentsByDog);
router.get('/status/:status', getAppointmentsByStatus);

// Cancel appointment (soft delete)
router.patch('/:id/cancel', cancelAppointment);

// Standard CRUD routes
router.route('/')
  .get(getAllAppointments)
  .post(createAppointment);

router.route('/:id')
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(deleteAppointment);

module.exports = router;
