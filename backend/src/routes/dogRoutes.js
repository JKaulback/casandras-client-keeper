const express = require('express');
const router = express.Router();
const dogsController = require('../controllers/dogController');

// Search route (must be before /:id to avoid conflict)
router.get('/search', dogsController.searchDogs);

// Get dogs by owner
router.get('/owner/:ownerId', dogsController.getDogsByOwner);

// Standard CRUD routes
router.route('/')
  .get(dogsController.getAllDogs)
  .post(dogsController.createDog);

router.route('/:id')
  .get(dogsController.getDogById)
  .put(dogsController.updateDog)
  .delete(dogsController.deleteDog);

module.exports = router;
