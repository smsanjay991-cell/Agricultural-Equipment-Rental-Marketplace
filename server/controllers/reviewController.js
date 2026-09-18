const Review = require('../models/Review');
const Equipment = require('../models/Equipment');
const Booking = require('../models/Booking');

// @desc    Submit a review for completed equipment rental
// @route   POST /api/reviews
// @access  Private (Farmer only)
const createReview = async (req, res) => {
  try {
    const { equipmentId, equipment, bookingId, booking, rating, comment } = req.body;
    const farmerId = req.user._id || req.user.id;

    const targetEquipmentId = equipmentId || equipment;
    const targetBookingId = bookingId || booking;

    // 1. Validate required fields
    if (!rating) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required'
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || !Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
      });
    }

    if (!comment || typeof comment !== 'string' || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment is required and cannot be empty'
      });
    }

    if (!targetEquipmentId) {
      return res.status(400).json({
        success: false,
        message: 'Equipment ID is required'
      });
    }

    if (!targetBookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }

    // 2. Validate Equipment exists
    const eqItem = await Equipment.findById(targetEquipmentId);
    if (!eqItem) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    // 3. Validate Booking exists
    const bookingItem = await Booking.findById(targetBookingId);
    if (!bookingItem) {
      return res.status(404).json({
        success: false,
        message: 'Rental booking not found'
      });
    }

    // 4. Validate Booking belongs to the logged-in farmer
    const bFarmerId = bookingItem.farmer_id || bookingItem.farmerId || (bookingItem.farmer ? (bookingItem.farmer._id || bookingItem.farmer.id) : null);
    if (String(bFarmerId) !== String(farmerId)) {
      return res.status(403).json({
        success: false,
        message: 'You can only review equipment from your own rental bookings'
      });
    }

    // 5. Validate Booking belongs to the specified equipment
    const bEquipmentId = bookingItem.equipment_id || bookingItem.equipmentId || (bookingItem.equipment ? (bookingItem.equipment._id || bookingItem.equipment.id) : null);
    if (String(bEquipmentId) !== String(targetEquipmentId)) {
      return res.status(400).json({
        success: false,
        message: 'Booking does not match the specified equipment'
      });
    }

    // 6. Validate Booking is completed
    const rawStatus = (bookingItem.booking_status || bookingItem.bookingStatus || bookingItem.status || '').toLowerCase();
    if (rawStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Reviews can only be submitted after the rental booking is completed'
      });
    }

    // 7. Prevent duplicate review for the same booking
    const existingReview = await Review.findByBooking(targetBookingId);
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'A review has already been submitted for this rental booking'
      });
    }

    // 8. Create review and update equipment ratings
    const createdReview = await Review.create({
      equipment: targetEquipmentId,
      farmer: farmerId,
      booking: targetBookingId,
      rating: numRating,
      comment: comment.trim()
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: createdReview
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error submitting review'
    });
  }
};

// @desc    Get reviews for specific equipment
// @route   GET /api/reviews/equipment/:equipmentId
// @access  Public / Authenticated
const getEquipmentReviews = async (req, res) => {
  try {
    const { equipmentId } = req.params;
    const reviews = await Review.find({ equipment: equipmentId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching equipment reviews'
    });
  }
};

// @desc    Get reviews submitted by logged in farmer
// @route   GET /api/reviews/my
// @access  Private (Farmer)
const getMyReviews = async (req, res) => {
  try {
    const farmerId = req.user._id || req.user.id;
    const reviews = await Review.find({ farmer: farmerId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching farmer reviews'
    });
  }
};

// @desc    Get all reviews (Admin governance)
// @route   GET /api/reviews
// @access  Private (Admin)
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({});
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching all reviews'
    });
  }
};

module.exports = {
  createReview,
  getEquipmentReviews,
  getMyReviews,
  getAllReviews
};
