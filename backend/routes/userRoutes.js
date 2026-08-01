const express = require('express');
const router = express.Router();
const { getUsers, updateUserProfile } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, authorizeRoles('admin'), getUsers);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
