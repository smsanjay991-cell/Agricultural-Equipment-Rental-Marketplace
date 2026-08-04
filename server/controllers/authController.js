const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validateEmail } = require('../utils/validator');

// @desc    Register a new user (Farmer, Owner, Admin)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, location } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, and phone'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // Check if user already exists
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email address'
      });
    }

    // Validate role
    const userRole = role && ['farmer', 'owner', 'admin'].includes(role.toLowerCase())
      ? role.toLowerCase()
      : 'farmer';

    // Create user in MySQL (password is hashed inside User.create)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone,
      role: userRole,
      location: location || ''
    });

    if (user) {
      const token = generateToken(user._id, user.role);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          _id: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          location: user.location,
          avatar: user.avatar,
          token
        }
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid user data received'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during user registration'
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find user and include password for comparison
    const user = await User.findByEmail(email, true);

    if (user && (await User.matchPassword(password, user.password))) {
      const token = generateToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          location: user.location,
          avatar: user.avatar,
          token
        }
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          location: user.location,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'User profile not found'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching profile'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
