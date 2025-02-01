const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  discountValue: {
    type: Number,
    required: true,
  },
});

const bookingRequestSchema = new mongoose.Schema({
  reference_number: {
    type: Number,
    required: true,
  },
  coupon_code: {
    type: Number,
    required: true,
  },
  show_id: {
    type: Number,
    required: true,
  },
  tickets: {
    type: [Number],
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  userid: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Validates email format
  },
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  contact: {
    type: String,
    required: true,
    trim: true,
    match: /^\d{10}$/, // Validates 10-digit phone number
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'admin'], // Ensures only 'user' or 'admin' as values
  },
  isLoggedIn: {
    type: Boolean,
    required: true,
    default: false,
  },
  uuid: {
    type: String,
    trim: true,
    default: '',
  },
  accesstoken: {
    type: String,
    trim: true,
    default: '',
  },
  coupens: {
    type: [couponSchema],
    required: true,
  },
  bookingRequests: {
    type: [bookingRequestSchema],
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);