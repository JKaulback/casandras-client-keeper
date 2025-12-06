const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers
} = require('../controllers/customerController');

// Search route (must be before /:id to avoid conflict)
router.get('/search', searchCustomers);

// Standard CRUD routes
router.route('/')
  .get(getAllCustomers)
  .post(createCustomer);

router.route('/:id')
  .get(getCustomerById)
  .put(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;
