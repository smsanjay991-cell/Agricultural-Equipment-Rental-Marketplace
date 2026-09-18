const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// @desc    Initiate/record payment for an approved rental booking
// @route   POST /api/payments
// @access  Private (Farmer)
const createPayment = async (req, res) => {
  try {
    const { bookingId, booking_id, amount, paymentMethod, payment_method, transactionId, transaction_id } = req.body;
    const farmerId = req.user._id || req.user.id;
    const targetBookingId = bookingId || booking_id;
    const targetMethod = paymentMethod || payment_method || 'UPI/QR';
    const targetTxnId = transactionId || transaction_id || null;

    // 1. Validate required fields
    if (!targetBookingId) {
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }

    if (amount === undefined || amount === null) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount is required'
      });
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Payment amount must be a positive number'
      });
    }

    // 2. Validate Booking existence
    const bookingItem = await Booking.findById(targetBookingId);
    if (!bookingItem) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found'
      });
    }

    // 3. Validate Booking ownership (Logged in farmer only)
    const bFarmerId = bookingItem.farmer_id || bookingItem.farmerId || (bookingItem.farmer ? (bookingItem.farmer._id || bookingItem.farmer.id) : null);
    if (String(bFarmerId) !== String(farmerId) && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make payment for another user\'s booking'
      });
    }

    // 4. Validate Booking Status (Must be Approved or Completed)
    const normBookingStatus = (bookingItem.booking_status || bookingItem.bookingStatus || bookingItem.status || '').toLowerCase();
    if (normBookingStatus !== 'approved' && normBookingStatus !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `Payments are only permitted for approved rental bookings. Current booking status is '${normBookingStatus}'`
      });
    }

    // 5. Prevent Duplicate / Second Payment
    const normPaymentStatus = (bookingItem.payment_status || bookingItem.paymentStatus || '').toLowerCase();
    if (normPaymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment has already been completed for this booking'
      });
    }

    const existingPayments = await Payment.findByBooking(targetBookingId);
    const completedPayment = existingPayments.find(p => (p.payment_status || p.paymentStatus || '').toLowerCase() === 'completed');
    if (completedPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment has already been completed for this booking'
      });
    }

    // 6. Record Payment
    const paymentRecord = await Payment.create({
      bookingId: targetBookingId,
      farmerId: bFarmerId,
      amount: numAmount,
      paymentStatus: 'Completed',
      paymentMethod: targetMethod,
      transactionId: targetTxnId
    });

    return res.status(201).json({
      success: true,
      message: 'Payment processed and recorded successfully',
      data: paymentRecord
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error processing payment'
    });
  }
};

// @desc    Get payment information for a specific booking
// @route   GET /api/payments/booking/:bookingId
// @access  Private (Farmer / Owner / Admin)
const getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const bookingItem = await Booking.findById(bookingId);
    if (!bookingItem) {
      return res.status(404).json({
        success: false,
        message: 'Booking record not found'
      });
    }

    const userIdStr = (req.user._id || req.user.id).toString();
    const farmerIdStr = bookingItem.farmer_id ? bookingItem.farmer_id.toString() : (bookingItem.farmer ? (bookingItem.farmer._id || bookingItem.farmer.id).toString() : '');
    const ownerIdStr = bookingItem.owner_id ? bookingItem.owner_id.toString() : (bookingItem.equipment && bookingItem.equipment.owner ? (bookingItem.equipment.owner._id || bookingItem.equipment.owner.id).toString() : '');

    const isFarmer = farmerIdStr === userIdStr;
    const isOwner = ownerIdStr === userIdStr;
    const isAdmin = req.user.role === 'admin';

    if (!isFarmer && !isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view payment details for this booking'
      });
    }

    const payments = await Payment.findByBooking(bookingId);
    return res.status(200).json({
      success: true,
      data: payments.length > 0 ? payments[0] : null,
      history: payments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching booking payment info'
    });
  }
};

// @desc    Get payments submitted by logged in farmer
// @route   GET /api/payments/my
// @access  Private (Farmer)
const getMyPayments = async (req, res) => {
  try {
    const farmerId = req.user._id || req.user.id;
    const payments = await Payment.findByFarmer(farmerId);
    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching farmer payment records'
    });
  }
};

// @desc    Get all payments (Admin audit overview)
// @route   GET /api/payments
// @access  Private (Admin)
const getAllPayments = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required for platform financial audit'
      });
    }

    const payments = await Payment.findAll();
    return res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching all payment records'
    });
  }
};

// @desc    Update payment status (Admin only)
// @route   PUT /api/payments/:id/status
// @access  Private (Admin)
const updatePaymentStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin authorization required to update payment status'
      });
    }

    const { paymentStatus, payment_status } = req.body;
    const pStatus = paymentStatus || payment_status;
    const allowed = ['Pending', 'Completed', 'Failed', 'Refunded', 'pending', 'completed', 'failed', 'refunded'];

    if (!pStatus || !allowed.includes(pStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status requested. Allowed: Pending, Completed, Failed, Refunded'
      });
    }

    const formattedStatus = pStatus.charAt(0).toUpperCase() + pStatus.slice(1).toLowerCase();

    const existing = await Payment.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    const updated = await Payment.updateStatus(req.params.id, formattedStatus);
    return res.status(200).json({
      success: true,
      message: `Payment status updated to ${formattedStatus}`,
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating payment status'
    });
  }
};

module.exports = {
  createPayment,
  getPaymentByBooking,
  getMyPayments,
  getAllPayments,
  updatePaymentStatus
};
