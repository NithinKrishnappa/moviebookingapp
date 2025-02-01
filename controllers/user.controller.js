const User = require('../models/user.model');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your_secret_key'; // Change this in production

// Sign Up (Create a user)
exports.signUp = async (req, res) => {
  try {
    const { email, first_name, last_name, contact, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      userid: uuidv4(), // Generate a unique user ID
      email,
      first_name,
      last_name,
      username,
      contact,
      password,
      role: role || 'user', // Default role is 'user'
      isLoggedIn: false,
      uuid: '',
      accesstoken: '',
      coupens: [],
      bookingRequests: [],
    });

    // Save the user
    await newUser.save();

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error signing up', error });
  }
};

// Login (Authenticate user)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch =  password === user.password;
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    // Generate access token
    const token = jwt.sign({ userid: user.userid, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    // Update user session details
    user.isLoggedIn = true;
    user.uuid = uuidv4();
    user.accesstoken = token;
    await user.save();

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

// Logout (Remove session details)
exports.logout = async (req, res) => {
  try {
    const { userid } = req.body;

    // Find the user
    const user = await User.findOne({ userid });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Reset login session
    user.isLoggedIn = false;
    user.uuid = '';
    user.accesstoken = '';
    await user.save();

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error });
  }
}

// Get Coupon Code
exports.getCouponCode = async (req, res) => {
    try {
      const { userid } = req.query;
  
      if (!userid) {
        return res.status(400).json({ message: 'User ID is required' });
      }
  
      const user = await User.findOne({ userid });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      return res.status(200).json({ coupons: user.coupens });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };
  
  // Book Show
  exports.bookShow = async (req, res) => {
    try {
      const { userid, show_id, tickets, coupon_code } = req.body;
  
      if (!userid || !show_id || !tickets) {
        return res.status(400).json({ message: 'User ID, Show ID, and Tickets are required' });
      }
  
      const user = await User.findOne({ userid });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const reference_number = Math.floor(Math.random() * 100000); // Generate a random reference number
  
      const newBooking = {
        reference_number,
        coupon_code: coupon_code || null,
        show_id,
        tickets
      };
  
      user.bookingRequests.push(newBooking);
      await user.save();
  
      return res.status(201).json({
        message: 'Booking successful',
        booking: newBooking
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };