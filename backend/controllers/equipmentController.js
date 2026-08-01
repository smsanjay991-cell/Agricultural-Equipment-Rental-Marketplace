const Equipment = require('../models/Equipment');
const Review = require('../models/Review');

// @desc    Get all equipment with search & filtering
// @route   GET /api/equipment
// @access  Public
const getEquipment = async (req, res) => {
  try {
    const { category, search, location, minPrice, maxPrice, isDriverAvailable } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.dailyRate = {};
      if (minPrice) query.dailyRate.$gte = Number(minPrice);
      if (maxPrice) query.dailyRate.$lte = Number(maxPrice);
    }

    if (isDriverAvailable === 'true') {
      query.isDriverAvailable = true;
    }

    const equipmentList = await Equipment.find(query).populate('owner', 'name phone location email');
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
    const item = await Equipment.findById(req.params.id).populate('owner', 'name phone location email avatar');
    if (!item) {
      return res.status(404).json({ message: 'Equipment listing not found' });
    }
    const reviews = await Review.find({ equipment: req.params.id }).populate('farmer', 'name avatar');
    res.json({ ...item.toObject(), reviews });
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

    const equipment = new Equipment({
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

    const createdEquipment = await equipment.save();
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

    if (equipment.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this equipment' });
    }

    Object.assign(equipment, req.body);
    const updatedEquipment = await equipment.save();
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

    if (equipment.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this equipment' });
    }

    await equipment.deleteOne();
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
