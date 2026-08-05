const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const { calculateBookingCost, hasBookingConflict } = require('../services/bookingService');
const { validateDateRange } = require('../utils/validator');

// @desc    Create a new equipment booking
// @route   POST /api/bookings
// @access  Private (Farmer)
const createBooking = async (req, res) => {
  try {
    const {
      equipmentId,
      equipment_id,
      startDate,
      start_date,
      endDate,
      end_date,
      includeDriver,
      include_driver,
      notes,
      remarks
    } = req.body;

    const eqId = equipmentId || equipment_id;
    const sDate = startDate || start_date;
    const eDate = endDate || end_date;
    const incDriver = includeDriver !== undefined ? includeDriver : (include_driver !== undefined ? include_driver : false);
    const notesText = notes || remarks || '';

    // 1. Validate required input fields
    if (!eqId || !sDate || !eDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required booking fields: equipmentId, startDate, and endDate'
      });
    }

    // 2. Validate date logic (start < end, start >= today)
    const dateValidation = validateDateRange(sDate, eDate);
    if (!dateValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: dateValidation.message || 'Invalid date range specified'
      });
    }

    // 3. Verify equipment existence
    const equipment = await Equipment.findById(eqId);
    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment listing not found'
      });
    }

    // 4. Verify equipment active availability
    if (!equipment.isAvailable && !equipment.availability) {
      return res.status(400).json({
        success: false,
        message: 'Equipment is currently marked unavailable by owner'
      });
    }

    // 5. Prevent farmers from booking their own listed equipment
    const ownerIdStr = equipment.owner_id ? equipment.owner_id.toString() : (equipment.owner ? (equipment.owner._id || equipment.owner.id).toString() : '');
    const userIdStr = (req.user._id || req.user.id).toString();

    if (ownerIdStr === userIdStr) {
      return res.status(400).json({
        success: false,
        message: 'Equipment owners cannot book their own equipment'
      });
    }

    // 6. Check scheduling collision for active reservations
    const conflict = await hasBookingConflict(eqId, sDate, eDate);
    if (conflict) {
      return res.status(400).json({
        success: false,
        message: 'Equipment is already reserved for the selected dates'
      });
    }

    // 7. Calculate rental duration and total costs
    const costDetails = calculateBookingCost({
      startDate: sDate,
      endDate: eDate,
      dailyRate: equipment.dailyRate || equipment.dailyRent || 0,
      isDriverAvailable: equipment.isDriverAvailable || equipment.is_driver_available || false,
      driverRatePerDay: equipment.driverRatePerDay || equipment.driver_rate_per_day || 0,
      includeDriver: incDriver
    });

    // 8. Create booking record in MySQL
    const createdBooking = await Booking.create({
      equipmentId: eqId,
      farmerId: req.user._id || req.user.id,
      ownerId: ownerIdStr,
      startDate: sDate,
      endDate: eDate,
      totalDays: costDetails.totalDays,
      dailyRent: costDetails.dailyRate,
      dailyRate: costDetails.dailyRate,
      includeDriver: incDriver,
      driverCost: costDetails.driverCost,
      totalAmount: costDetails.totalPrice,
      totalPrice: costDetails.totalPrice,
      depositAmount: equipment.deposit || 0,
      remarks: notesText,
      notes: notesText,
      bookingStatus: 'pending',
      status: 'Pending',
      paymentStatus: 'pending'
    });

    return res.status(201).json({
      success: true,
      message: 'Booking request created successfully',
      data: createdBooking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating booking request'
    });
  }
};

// @desc    Get all platform bookings
// @route   GET /api/bookings/all
// @access  Private (Admin)
const getAllBookings = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view all platform bookings'
      });
    }

    const bookings = await Booking.findAll();
    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching all bookings'
    });
  }
};

// @desc    Get single booking details by ID
// @route   GET /api/bookings/:id
// @access  Private (Farmer / Owner / Admin)
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found'
      });
    }

    const userIdStr = (req.user._id || req.user.id).toString();
    const farmerIdStr = booking.farmerId ? booking.farmerId.toString() : (booking.farmer ? (booking.farmer._id || booking.farmer.id).toString() : '');
    const ownerIdStr = booking.ownerId ? booking.ownerId.toString() : (booking.equipment && booking.equipment.owner ? (booking.equipment.owner._id || booking.equipment.owner.id).toString() : '');

    const isFarmer = farmerIdStr === userIdStr;
    const isOwner = ownerIdStr === userIdStr;
    const isAdmin = req.user.role === 'admin';

    if (!isFarmer && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    return res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching booking details'
    });
  }
};

// @desc    Get user's own bookings (Farmer view or dynamic based on role)
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (req.user.role === 'owner') {
      const ownerBookings = await Booking.findByOwner(userId);
      return res.status(200).json({
        success: true,
        count: ownerBookings.length,
        data: ownerBookings
      });
    }

    const farmerBookings = await Booking.findByFarmer(userId);
    return res.status(200).json({
      success: true,
      count: farmerBookings.length,
      data: farmerBookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching my bookings'
    });
  }
};

// @desc    Get equipment rental requests for Owner
// @route   GET /api/bookings/owner
// @access  Private (Owner / Admin)
const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view equipment owner booking requests'
      });
    }

    const ownerId = req.user._id || req.user.id;
    const bookings = await Booking.findByOwner(ownerId);

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching owner booking requests'
    });
  }
};

// @desc    Approve a booking request
// @route   PUT /api/bookings/:id/approve
// @access  Private (Owner / Admin)
const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found'
      });
    }

    const userIdStr = (req.user._id || req.user.id).toString();
    const ownerIdStr = booking.ownerId ? booking.ownerId.toString() : (booking.equipment && booking.equipment.owner ? (booking.equipment.owner._id || booking.equipment.owner.id).toString() : '');

    if (ownerIdStr !== userIdStr && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to approve this booking request'
      });
    }

    const updatedBooking = await Booking.updateStatus(req.params.id, 'approved');

    return res.status(200).json({
      success: true,
      message: 'Booking request approved successfully',
      data: updatedBooking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error approving booking'
    });
  }
};

// @desc    Reject a booking request
// @route   PUT /api/bookings/:id/reject
// @access  Private (Owner / Admin)
const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found'
      });
    }

    const userIdStr = (req.user._id || req.user.id).toString();
    const ownerIdStr = booking.ownerId ? booking.ownerId.toString() : (booking.equipment && booking.equipment.owner ? (booking.equipment.owner._id || booking.equipment.owner.id).toString() : '');

    if (ownerIdStr !== userIdStr && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this booking request'
      });
    }

    const updatedBooking = await Booking.updateStatus(req.params.id, 'rejected');

    return res.status(200).json({
      success: true,
      message: 'Booking request rejected successfully',
      data: updatedBooking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error rejecting booking'
    });
  }
};

// @desc    Cancel a booking request
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Farmer / Owner / Admin)
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found'
      });
    }

    const userIdStr = (req.user._id || req.user.id).toString();
    const farmerIdStr = booking.farmerId ? booking.farmerId.toString() : (booking.farmer ? (booking.farmer._id || booking.farmer.id).toString() : '');
    const ownerIdStr = booking.ownerId ? booking.ownerId.toString() : (booking.equipment && booking.equipment.owner ? (booking.equipment.owner._id || booking.equipment.owner.id).toString() : '');

    const isFarmer = farmerIdStr === userIdStr;
    const isOwner = ownerIdStr === userIdStr;
    const isAdmin = req.user.role === 'admin';

    if (!isFarmer && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // If farmer is cancelling, verify booking is in pending state
    if (isFarmer && !isOwner && !isAdmin) {
      const currentStatus = (booking.bookingStatus || booking.status || '').toLowerCase();
      if (currentStatus !== 'pending') {
        return res.status(400).json({
          success: false,
          message: 'Farmers can only cancel pending booking requests'
        });
      }
    }

    const updatedBooking = await Booking.cancelBooking(req.params.id, userIdStr);

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: updatedBooking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error cancelling booking'
    });
  }
};

// @desc    Update booking status generically (Accept / Reject / Cancel / Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus, payment_status } = req.body;
    const pStatus = paymentStatus || payment_status;
    const allowedStatuses = ['pending', 'approved', 'rejected', 'completed', 'cancelled', 'Pending', 'Approved', 'Rejected', 'Completed', 'Cancelled'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status transition requested'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found'
      });
    }

    const userIdStr = (req.user._id || req.user.id).toString();
    const farmerIdStr = booking.farmerId ? booking.farmerId.toString() : (booking.farmer ? (booking.farmer._id || booking.farmer.id).toString() : '');
    const ownerIdStr = booking.ownerId ? booking.ownerId.toString() : (booking.equipment && booking.equipment.owner ? (booking.equipment.owner._id || booking.equipment.owner.id).toString() : '');

    const isOwner = ownerIdStr === userIdStr;
    const isFarmer = farmerIdStr === userIdStr;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isFarmer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    const updatedBooking = await Booking.updateStatus(req.params.id, status, pStatus);
    return res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating booking status'
    });
  }
};

// @desc    Delete booking (Admin only)
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
const deleteBooking = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete booking records'
      });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found'
      });
    }

    await Booking.delete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting booking'
    });
  }
};

module.exports = {
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
};
