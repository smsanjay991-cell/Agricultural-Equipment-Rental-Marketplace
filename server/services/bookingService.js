const Booking = require('../models/Booking');

/**
 * Calculates rental price and days based on dates, equipment daily rate, and driver options.
 */
const calculateBookingCost = ({ startDate, endDate, dailyRate, isDriverAvailable, driverRatePerDay, includeDriver }) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

  const baseEquipmentCost = diffDays * dailyRate;
  let driverCost = 0;

  if (includeDriver && isDriverAvailable) {
    driverCost = diffDays * (driverRatePerDay || 0);
  }

  const totalPrice = baseEquipmentCost + driverCost;

  return {
    totalDays: diffDays,
    dailyRate,
    driverCost,
    totalPrice
  };
};

/**
 * Checks if equipment has an overlapping active reservation for the requested dates.
 */
const hasBookingConflict = async (equipmentId, startDate, endDate, excludeBookingId = null) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const query = {
    equipment: equipmentId,
    status: { $in: ['Pending', 'Approved'] },
    $or: [
      { startDate: { $lte: end }, endDate: { $gte: start } }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBooking = await Booking.findOne(query);
  return !!conflictingBooking;
};

module.exports = {
  calculateBookingCost,
  hasBookingConflict
};
