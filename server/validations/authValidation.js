const { validateEmail } = require('../utils/validator');

const validateRegisterInput = (data) => {
  const errors = {};
  if (!data.name || !data.name.trim()) errors.name = 'Name is required';
  if (!data.email || !validateEmail(data.email)) errors.email = 'Valid email is required';
  if (!data.password || data.password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (!data.phone || !data.phone.trim()) errors.phone = 'Phone number is required';
  if (!data.location || !data.location.trim()) errors.location = 'Location is required';

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

const validateLoginInput = (data) => {
  const errors = {};
  if (!data.email || !validateEmail(data.email)) errors.email = 'Valid email is required';
  if (!data.password) errors.password = 'Password is required';

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput
};
