const User = require('../models/User');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user directory'
    });
  }
};

// @desc    Get single user details by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User record not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching user details'
    });
  }
};

// @desc    Update user profile & role (Admin only)
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role, location, avatar } = req.body;

    // 1. Verify user existence
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User record not found'
      });
    }

    // 2. Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full name is required'
      });
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // 3. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    // 4. Validate duplicate email against other users
    const trimmedEmail = email.trim().toLowerCase();
    if (trimmedEmail !== existingUser.email.toLowerCase()) {
      const emailUser = await User.findByEmail(trimmedEmail);
      if (emailUser && String(emailUser.id) !== String(id)) {
        return res.status(400).json({
          success: false,
          message: 'Email address is already registered to another account'
        });
      }
    }

    // 5. Validate role restriction
    const allowedRoles = ['farmer', 'owner', 'admin'];
    const targetRole = role ? role.toLowerCase() : existingUser.role;
    if (!allowedRoles.includes(targetRole)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user role specified. Allowed roles: farmer, owner, admin'
      });
    }

    // 6. Update user record
    const updatedUser = await User.updateUser(id, {
      name: name.trim(),
      email: trimmedEmail,
      phone: phone !== undefined ? phone : existingUser.phone,
      role: targetRole,
      location: location !== undefined ? location : existingUser.location,
      avatar: avatar !== undefined ? avatar : existingUser.avatar
    });

    return res.status(200).json({
      success: true,
      message: 'User profile and role updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating user record'
    });
  }
};

// @desc    Delete user account (Admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const currentAdminId = req.user._id || req.user.id;

    // 1. Self-deletion prevention guard
    if (String(id) === String(currentAdminId)) {
      return res.status(400).json({
        success: false,
        message: 'Administrators cannot delete their own active account'
      });
    }

    // 2. Verify user existence
    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User record not found'
      });
    }

    // 3. Perform database deletion
    await User.delete(id);

    return res.status(200).json({
      success: true,
      message: `User account '${targetUser.name}' (#${id}) deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting user account'
    });
  }
};

// @desc    Update user profile details (Self profile update)
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const updatedUser = await User.updateProfile(userId, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      location: req.body.location,
      avatar: req.body.avatar,
      password: req.body.password
    });

    if (updatedUser) {
      return res.status(200).json({
        success: true,
        data: {
          _id: updatedUser._id,
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
          location: updatedUser.location,
          avatar: updatedUser.avatar
        }
      });
    } else {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserProfile
};
