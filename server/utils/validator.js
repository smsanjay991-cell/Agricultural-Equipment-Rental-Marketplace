const validateEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { isValid: false, message: 'Invalid date format' };
  }
  if (start >= end) {
    return { isValid: false, message: 'End date must be after start date' };
  }
  return { isValid: true };
};

module.exports = {
  validateEmail,
  validateDateRange
};
