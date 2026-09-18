
const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPaymentByBooking,
  getMyPayments,
  getAllPayments,
  updatePaymentStatus
} = require('../controllers/paymentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Specific sub-routes (Declared BEFORE parametric routes)
router.get('/my', protect, authorizeRoles('farmer', 'admin'), getMyPayments);
router.get('/booking/:bookingId', protect, getPaymentByBooking);

// Base route (Admin GET all, Farmer POST payment)
router.route('/')
  .get(protect, authorizeRoles('admin'), getAllPayments)
  .post(protect, authorizeRoles('farmer', 'admin'), createPayment);

// Parametric status route
router.put('/:id/status', protect, authorizeRoles('admin'), updatePaymentStatus);

module.exports = router;
