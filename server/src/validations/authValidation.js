const { check, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map(err => err.msg).join(', '),
      errors: errors.array()
    });
  }
  next();
};

const validateRegister = [
  check('name', 'Name is required and cannot be empty').notEmpty().trim(),
  check('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
  check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  validate
];

const validateLogin = [
  check('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
  check('password', 'Password is required').notEmpty(),
  validate
];

const validateForgotPassword = [
  check('email', 'Please enter a valid email address').isEmail().normalizeEmail(),
  validate
];

const validateResetPassword = [
  check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  validate
];

module.exports = {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword
};
