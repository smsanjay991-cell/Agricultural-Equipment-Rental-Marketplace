const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const { calculateBookingCost, hasBookingConflict } = require('../services/bookingService');
const { validateDateRange } = require('../utils/validator');

// @desc    Create a new equipment booking
// @route   POST /api/bookings
// @access  Private/Farmer
const createBooking = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate, includeDriver, notes } = req.body;

    const dateValidation = validateDateRange(startDate, endDate);
    if (!dateValidation.isValid) {
      return res.status(400).json({ message: dateValidation.message });
    }

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    if (!equipment.isAvailable) {
      return res.status(400).json({ message: 'Equipment is currently marked unavailable' });
    }

    // Check scheduling collision
    const conflict = await hasBookingConflict(equipmentId, startDate, endDate);
    if (conflict) {
      return res.status(400).json({ message: 'Equipment is already reserved for the selected dates' });
    }

    const costDetails = calculateBookingCost({
      startDate,
      endDate,
      dailyRate: equipment.dailyRate,
      isDriverAvailable: equipment.isDriverAvailable,
      driverRatePerDay: equipment.driverRatePerDay,
      includeDriver
    });

    const createdBooking = await Booking.create({
      equipment: equipmentId,
      farmer: req.user._id,
      startDate,
      endDate,
      totalDays: costDetails.totalDays,
      dailyRate: costDetails.dailyRate,
      includeDriver: includeDriver || false,
      driverCost: costDetails.driverCost,
      totalPrice: costDetails.totalPrice,
      notes: notes || '',
      status: 'Pending'
    });

    res.status(201).json(createdBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings (Farmer sees own, Owner sees requests for their equipment)
// @route   GET /api/bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    if (req.user.role === 'owner') {
      const ownerEquipment = await Equipment.find({ owner: req.user._id });
      const equipmentIds = ownerEquipment.map(item => item._id || item.id);

      const ownerBookings = await Booking.findByEquipmentIds(equipmentIds);
      return res.json(ownerBookings);
    }

    const farmerBookings = await Booking.findByFarmer(req.user._id);
    res.json(farmerBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status (Accept / Reject / Cancel / Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['Approved', 'Rejected', 'Completed', 'Cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking record not found' });
    }

    const ownerIdStr = booking.equipment && booking.equipment.owner ? (booking.equipment.owner._id || booking.equipment.owner.id).toString() : '';
    const farmerIdStr = booking.farmer ? (booking.farmer._id || booking.farmer.id).toString() : '';
    const userIdStr = (req.user._id || req.user.id).toString();

    const isOwner = ownerIdStr === userIdStr;
    const isFarmer = farmerIdStr === userIdStr;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isFarmer && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    const updatedBooking = await Booking.updateStatus(req.params.id, status);
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  updateBookingStatus
};
