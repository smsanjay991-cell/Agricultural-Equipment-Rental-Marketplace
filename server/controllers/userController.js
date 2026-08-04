const User = require('../models/User');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await User.updateProfile(req.user._id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      avatar: req.body.avatar,
      password: req.body.password
    });

    if (updatedUser) {
      res.json({
        _id: updatedUser._id,
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        location: updatedUser.location,
        avatar: updatedUser.avatar
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUsers,
  updateUserProfile
};
