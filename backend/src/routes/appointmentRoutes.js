const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Special routes (must be before /:id to avoid conflicts)
router.get('/range', appointmentController.getAppointmentsByDateRange);
router.get('/customer/:customerId', appointmentController.getAppointmentsByCustomer);
router.get('/dog/:dogId', appointmentController.getAppointmentsByDog);
router.get('/status/:status', appointmentController.getAppointmentsByStatus);

// Cancel appointment (soft delete)
router.patch('/:id/cancel', appointmentController.cancelAppointment);
// Standard CRUD routes
router.route('/')
  .get(appointmentController.getAllAppointments)
  .post(appointmentController.createAppointment);

router.route('/:id')
  .get(appointmentController.getAppointmentById)
  .put(appointmentController.updateAppointment)
  .delete(appointmentController.deleteAppointment);

module.exports = router;
