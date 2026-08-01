const { validateDateRange } = require('../utils/validator');

const validateBookingInput = (data) => {
  const errors = {};
  if (!data.equipmentId) errors.equipmentId = 'Equipment ID is required';
  
  const dateCheck = validateDateRange(data.startDate, data.endDate);
  if (!dateCheck.isValid) {
    errors.dates = dateCheck.message;
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

module.exports = {
  validateBookingInput
};
