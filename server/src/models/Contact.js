const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    index: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    index: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    index: true
  },
  company: {
    type: String,
    trim: true,
    index: true
  },
  address: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  favorite: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to quickly find duplicates for a specific user
contactSchema.index({ user: 1, phone: 1 });
contactSchema.index({ user: 1, email: 1 });

module.exports = mongoose.model('Contact', contactSchema);
