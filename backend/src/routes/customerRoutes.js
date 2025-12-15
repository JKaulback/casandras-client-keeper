const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Search route (must be before /:id to avoid conflict)
router.get('/search', customerController.searchCustomers);

// Standard CRUD routes
router.route('/')
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer);

router.route('/:id')
  .get(customerController.getCustomerById)
  .put(customerController.updateCustomer)
  .delete(customerController.deleteCustomer);

module.exports = router;
