const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addUserAddress,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerRules, loginRules, profileRules, addressRules } = require('../middleware/validateMiddleware');

router.post('/register', registerRules, registerUser);
router.post('/login', loginRules, loginUser);
router.get('/me', protect, getUserProfile);
router.put('/profile', protect, profileRules, updateUserProfile);
router.put('/address', protect, addressRules, addUserAddress);

module.exports = router;
