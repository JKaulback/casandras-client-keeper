const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Standard CRUD routes
router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

// Custom route for OAuth lookup
router.get('/oauth/:oauthId', userController.getUserByOAuthId);

module.exports = router;
