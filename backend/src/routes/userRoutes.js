const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByOAuthId
} = require('../controllers/userController');

// Standard CRUD routes
router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

// Custom route for OAuth lookup
router.get('/oauth/:oauthId', getUserByOAuthId);

module.exports = router;
