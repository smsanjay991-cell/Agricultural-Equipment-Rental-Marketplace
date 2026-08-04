const Equipment = require('../models/Equipment');
const Review = require('../models/Review');

// @desc    Get all equipment with search & filtering
// @route   GET /api/equipment
// @access  Public
const getEquipment = async (req, res) => {
  try {
    const { category, search, location, minPrice, maxPrice, isDriverAvailable } = req.query;

    const equipmentList = await Equipment.find({
      category,
      search,
      location,
      minPrice,
      maxPrice,
      isDriverAvailable
    });

    res.json(equipmentList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get equipment by ID
// @route   GET /api/equipment/:id
// @access  Public
const getEquipmentById = async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Equipment listing not found' });
    }
    const reviews = await Review.find({ equipment: req.params.id });
    res.json({ ...item, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new equipment listing
// @route   POST /api/equipment
// @access  Private/Owner/Admin
const createEquipment = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      dailyRate,
      location,
      horsepower,
      fuelType,
      isDriverAvailable,
      driverRatePerDay,
      images
    } = req.body;

    const createdEquipment = await Equipment.create({
      owner: req.user._id,
      name,
      category,
      description,
      dailyRate,
      location,
      horsepower: horsepower || 0,
      fuelType: fuelType || 'Diesel',
      isDriverAvailable: isDriverAvailable || false,
      driverRatePerDay: driverRatePerDay || 0,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80']
    });

    res.status(201).json(createdEquipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update equipment listing
// @route   PUT /api/equipment/:id
// @access  Private/Owner/Admin
const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const ownerIdStr = equipment.owner ? (equipment.owner._id || equipment.owner.id).toString() : '';
    const userIdStr = (req.user._id || req.user.id).toString();

    if (ownerIdStr !== userIdStr && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this equipment' });
    }

    const updatedEquipment = await Equipment.update(req.params.id, req.body);
    res.json(updatedEquipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete equipment listing
// @route   DELETE /api/equipment/:id
// @access  Private/Owner/Admin
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const ownerIdStr = equipment.owner ? (equipment.owner._id || equipment.owner.id).toString() : '';
    const userIdStr = (req.user._id || req.user.id).toString();

    if (ownerIdStr !== userIdStr && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this equipment' });
    }

    await Equipment.deleteById(req.params.id);
    res.json({ message: 'Equipment listing removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
};
