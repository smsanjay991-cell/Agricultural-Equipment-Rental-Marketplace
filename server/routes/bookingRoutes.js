const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
  getOwnerBookings,
  approveBooking,
  rejectBooking,
  cancelBooking,
  updateBookingStatus,
  deleteBooking
} = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// ==========================================
// 1. SPECIFIC SUB-ROUTES (Declared BEFORE /:id to prevent route shadowing)
// ==========================================

// @route   GET /api/bookings/my
// @desc    Get logged in farmer's/user's bookings
// @access  Private (Farmer, Owner, Admin)
router.get('/my', protect, authorizeRoles('farmer', 'owner', 'admin'), getMyBookings);

// @route   GET /api/bookings/owner
// @desc    Get booking requests received by equipment owner
// @access  Private (Owner, Admin)
router.get('/owner', protect, authorizeRoles('owner', 'admin'), getOwnerBookings);

// @route   GET /api/bookings/all
// @desc    Get all platform bookings (Admin overview)
// @access  Private (Admin only)
router.get('/all', protect, authorizeRoles('admin'), getAllBookings);

// ==========================================
// 2. ROOT BASE ROUTE (/api/bookings)
// ==========================================

// @route   POST /api/bookings (Create booking request - Farmer)
// @route   GET /api/bookings (Fetch bookings / Admin all)
router.route('/')
  .post(protect, authorizeRoles('farmer', 'admin'), createBooking)
  .get(protect, (req, res, next) => {
    if (req.user.role === 'admin') {
      return getAllBookings(req, res, next);
    }
    return getMyBookings(req, res, next);
  });

// ==========================================
// 3. PARAMETRIC ROUTES (/:id AND ACTIONS)
// ==========================================

// @route   PUT /api/bookings/:id/approve
// @desc    Approve a booking request (Owner / Admin)
// @access  Private (Owner, Admin)
router.put('/:id/approve', protect, authorizeRoles('owner', 'admin'), approveBooking);

// @route   PUT /api/bookings/:id/reject
// @desc    Reject a booking request (Owner / Admin)
// @access  Private (Owner, Admin)
router.put('/:id/reject', protect, authorizeRoles('owner', 'admin'), rejectBooking);

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel a booking request (Farmer / Owner / Admin)
// @access  Private (Farmer, Owner, Admin)
router.put('/:id/cancel', protect, authorizeRoles('farmer', 'owner', 'admin'), cancelBooking);

// @route   PUT /api/bookings/:id/status
// @desc    Generic status update
// @access  Private
router.put('/:id/status', protect, updateBookingStatus);

// @route   GET /api/bookings/:id (View booking details)
// @route   DELETE /api/bookings/:id (Delete booking - Admin only)
router.route('/:id')
  .get(protect, getBookingById)
  .delete(protect, authorizeRoles('admin'), deleteBooking);

module.exports = router;
