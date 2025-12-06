const express = require('express');
const router = express.Router();
const {
  getAllDogs,
  getDogById,
  getDogsByOwner,
  createDog,
  updateDog,
  deleteDog,
  searchDogs
} = require('../controllers/dogController');

// Search route (must be before /:id to avoid conflict)
router.get('/search', searchDogs);

// Get dogs by owner
router.get('/owner/:ownerId', getDogsByOwner);

// Standard CRUD routes
router.route('/')
  .get(getAllDogs)
  .post(createDog);

router.route('/:id')
  .get(getDogById)
  .put(updateDog)
  .delete(deleteDog);

module.exports = router;
