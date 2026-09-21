const validateEquipmentInput = (data) => {
  const errors = {};
  const allowedCategories = ['Tractor', 'Harvester', 'Tiller', 'Seeder', 'Sprayer', 'Attachment', 'Other'];

  if (!data.name || !data.name.trim()) errors.name = 'Equipment name is required';
  if (!data.category || !allowedCategories.includes(data.category)) errors.category = 'Valid category is required';
  if (!data.description || !data.description.trim()) errors.description = 'Description is required';
  if (data.dailyRate === undefined || Number(data.dailyRate) <= 0) errors.dailyRate = 'Daily rate must be greater than 0';
  if (!data.location || !data.location.trim()) errors.location = 'Location is required';

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

module.exports = {
  validateEquipmentInput
};
