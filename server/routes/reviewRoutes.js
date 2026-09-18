const express = require('express');
const router = express.Router();
const {
  createReview,
  getEquipmentReviews,
  getMyReviews,
  getAllReviews
} = require('../controllers/reviewController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Public/Authenticated GET by equipment, Farmer POST review, Admin GET all
router.route('/')
  .get(protect, authorizeRoles('admin'), getAllReviews)
  .post(protect, authorizeRoles('farmer', 'admin'), createReview);

router.get('/my', protect, authorizeRoles('farmer', 'admin'), getMyReviews);
router.get('/equipment/:equipmentId', getEquipmentReviews);

module.exports = router;
