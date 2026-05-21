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
    index: true,
    validate: {
      validator: function(v) {
        return /^[6789]\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number starting with 9, 8, 7, or 6!`
    }
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

// Compound indexes with user field for query optimization and isolation
contactSchema.index({ user: 1, name: 1 });
contactSchema.index({ user: 1, phone: 1 });
contactSchema.index({ user: 1, email: 1 });
contactSchema.index({ user: 1, company: 1 });

module.exports = mongoose.model('Contact', contactSchema);
