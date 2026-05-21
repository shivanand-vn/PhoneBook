const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../config/mail');
const { uploadImage } = require('../utils/cloudinaryHelper');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'supersecretjwtkey_phonebook_ai_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      return next(new Error('User already exists with this email'));
    }

    let avatarUrl = undefined;
    if (req.file) {
      avatarUrl = await uploadImage(req.file.buffer, 'avatars');
    }

    const user = await User.create({
      name,
      email,
      password,
      avatar: avatarUrl
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      return next(new Error('Invalid email or password'));
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      res.status(404);
      return next(new Error('User not found'));
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password flow
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404);
      return next(new Error('No account found with this email address'));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set expire time (10 minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Create reset URL
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e0ff; border-radius: 8px; background-color: #0b1326; color: #dae2fd;">
        <h2 style="color: #c0c1ff; border-bottom: 1px solid #464554; padding-bottom: 10px;">Phonebook AI Password Reset</h2>
        <p>You are receiving this email because you (or someone else) have requested the reset of a password for your account.</p>
        <p>Please click on the button below to reset your password. This link is only valid for 10 minutes:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="${resetUrl}" style="background-color: #8083ff; color: #0d0096; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p style="font-size: 12px; color: #908fa0; border-top: 1px solid #464554; padding-top: 10px; margin-top: 30px;">This is an automated message from Phonebook AI Enterprise System.</p>
      </div>
    `;

    const mailResult = await sendEmail({
      to: user.email,
      subject: 'Phonebook AI Password Reset Request',
      html: htmlMessage
    });

    if (mailResult.success) {
      res.json({
        success: true,
        message: 'Password reset link sent to your email.'
      });
    } else {
      // Clear token fields if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      
      res.status(500);
      return next(new Error('Failed to send reset email. Please try again later.'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    // Hash token from request to compare to DB stored token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      res.status(400);
      return next(new Error('Invalid or expired reset token'));
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (client-side handles actual destruction)
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'User logged out successfully. Clear token from storage.'
  });
};

module.exports = {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
  logout
};
