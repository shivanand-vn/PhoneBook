const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
  logout,
  updateProfile
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
} = require('../validations/authValidation');

router.post('/register', upload.single('avatar'), validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateResetPassword, resetPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.post('/logout', logout);

module.exports = router;
