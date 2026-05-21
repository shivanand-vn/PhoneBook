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

const validateContact = [
  check('name', 'Name is required').notEmpty().trim(),
  check('phone', 'Phone number is required').notEmpty().trim(),
  check('email', 'Please enter a valid email address').optional({ checkFalsy: true }).isEmail().normalizeEmail(),
  check('company').optional().trim(),
  check('address').optional().trim(),
  check('tags').optional().custom((value) => {
    if (value && typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) throw new Error();
      } catch (e) {
        // If it's a comma separated string, we can split it in controller, so it's fine
      }
    }
    return true;
  }),
  validate
];

module.exports = {
  validateContact
};
