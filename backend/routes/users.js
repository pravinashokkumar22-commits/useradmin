const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
} = require('../controllers/userController');
const { authenticate, isAdmin } = require('../middleware/auth');
const { updateUserValidation, updateProfileValidation } = require('../middleware/validation');

// Profile routes (any authenticated user)
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfileValidation, updateProfile);

// Admin user management routes
router.get('/users', authenticate, isAdmin, getAllUsers);
router.put('/users/:id', authenticate, isAdmin, updateUserValidation, updateUser);
router.delete('/users/:id', authenticate, isAdmin, deleteUser);

module.exports = router;
