const Equipment = require('../models/Equipment');
const Review = require('../models/Review');

// @desc    Create new equipment listing
// @route   POST /api/equipment
// @access  Private (Owner / Admin)
const addEquipment = async (req, res) => {
  try {
    const {
      name,
      category,
      category_id,
      categoryId,
      description,
      brand,
      model,
      daily_rent,
      dailyRent,
      dailyRate,
      daily_rate,
      deposit,
      availability,
      isAvailable,
      location,
      horsepower,
      fuelType,
      fuel_type,
      isDriverAvailable,
      is_driver_available,
      driverRatePerDay,
      driver_rate_per_day,
      image,
      images
    } = req.body;

    // Validate required fields
    const rentAmount = daily_rent !== undefined ? daily_rent : (dailyRent !== undefined ? dailyRent : (dailyRate !== undefined ? dailyRate : daily_rate));

    if (!name || !description || !location || rentAmount === undefined || rentAmount === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: name, description, location, and daily rent'
      });
    }

    let imageUrl = image || '';
    let imagesArr = Array.isArray(images) ? images : [];

    // If file uploaded via Multer
    if (req.file) {
      imageUrl = `/uploads/equipment/${req.file.filename}`;
      imagesArr.unshift(imageUrl);
    } else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadedUrls = req.files.map(f => `/uploads/equipment/${f.filename}`);
      imageUrl = uploadedUrls[0];
      imagesArr = [...uploadedUrls, ...imagesArr];
    }

    if (!imageUrl && imagesArr.length > 0) {
      imageUrl = imagesArr[0];
    }
    if (imagesArr.length === 0 && imageUrl) {
      imagesArr = [imageUrl];
    }
    if (imagesArr.length === 0) {
      imagesArr = ['https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'];
      imageUrl = imagesArr[0];
    }

    const createdEquipment = await Equipment.create({
      owner: req.user._id || req.user.id,
      owner_id: req.user._id || req.user.id,
      category_id: category_id || categoryId || null,
      name,
      category: category || 'General',
      description,
      brand: brand || '',
      model: model || '',
      daily_rent: Number(rentAmount),
      dailyRent: Number(rentAmount),
      dailyRate: Number(rentAmount),
      deposit: Number(deposit || 0),
      availability: availability !== undefined ? availability : (isAvailable !== undefined ? isAvailable : true),
      isAvailable: availability !== undefined ? availability : (isAvailable !== undefined ? isAvailable : true),
      location,
      image: imageUrl,
      horsepower: Number(horsepower || 0),
      fuelType: fuelType || fuel_type || 'Diesel',
      isDriverAvailable: isDriverAvailable !== undefined ? isDriverAvailable : (is_driver_available !== undefined ? is_driver_available : false),
      driverRatePerDay: Number(driverRatePerDay || driver_rate_per_day || 0),
      images: imagesArr
    });

    return res.status(201).json({
      success: true,
      message: 'Equipment created successfully',
      data: createdEquipment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating equipment'
    });
  }
};

// @desc    Get all equipment with search & filtering
// @route   GET /api/equipment
// @access  Public
const getAllEquipment = async (req, res) => {
  try {
    const { category, category_id, search, location, minPrice, maxPrice, isDriverAvailable } = req.query;

    const equipmentList = await Equipment.findAll({
      category,
      category_id,
      search,
      location,
      minPrice,
      maxPrice,
      isDriverAvailable
    });

    return res.status(200).json({
      success: true,
      count: equipmentList.length,
      data: equipmentList
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching equipment list'
    });
  }
};

// @desc    Get equipment by ID
// @route   GET /api/equipment/:id
// @access  Public
const getEquipmentById = async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Equipment listing not found'
      });
    }

    let reviews = [];
    if (Review && typeof Review.find === 'function') {
      try {
        reviews = await Review.find({ equipment: req.params.id });
      } catch (err) {
        reviews = [];
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        ...item,
        reviews
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching equipment details'
    });
  }
};

// @desc    Get equipment owned by logged in user
// @route   GET /api/equipment/my
// @access  Private (Owner / Admin)
const getMyEquipment = async (req, res) => {
  try {
    const ownerId = req.user._id || req.user.id;
    const equipmentList = await Equipment.findByOwner(ownerId);

    return res.status(200).json({
      success: true,
      count: equipmentList.length,
      data: equipmentList
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching owner equipment'
    });
  }
};

// @desc    Update equipment listing
// @route   PUT /api/equipment/:id
// @access  Private (Owner / Admin)
const updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    const ownerIdStr = equipment.owner_id ? equipment.owner_id.toString() : (equipment.owner ? (equipment.owner._id || equipment.owner.id).toString() : '');
    const userIdStr = (req.user._id || req.user.id).toString();

    if (ownerIdStr !== userIdStr && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this equipment'
      });
    }

    const updateData = { ...req.body };

    if (req.file) {
      const uploadedUrl = `/uploads/equipment/${req.file.filename}`;
      updateData.image = uploadedUrl;
      const currentImages = Array.isArray(equipment.images) ? [...equipment.images] : [];
      updateData.images = [uploadedUrl, ...currentImages];
    }

    const updatedEquipment = await Equipment.update(req.params.id, updateData);

    return res.status(200).json({
      success: true,
      message: 'Equipment updated successfully',
      data: updatedEquipment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating equipment'
    });
  }
};

// @desc    Delete equipment listing
// @route   DELETE /api/equipment/:id
// @access  Private (Owner / Admin)
const deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);

    if (!equipment) {
      return res.status(404).json({
        success: false,
        message: 'Equipment not found'
      });
    }

    const ownerIdStr = equipment.owner_id ? equipment.owner_id.toString() : (equipment.owner ? (equipment.owner._id || equipment.owner.id).toString() : '');
    const userIdStr = (req.user._id || req.user.id).toString();

    if (ownerIdStr !== userIdStr && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this equipment'
      });
    }

    await Equipment.delete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Equipment listing removed successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting equipment'
    });
  }
};

module.exports = {
  addEquipment,
  createEquipment: addEquipment,
  getAllEquipment,
  getEquipment: getAllEquipment,
  getEquipmentById,
  getMyEquipment,
  getOwnerEquipment: getMyEquipment,
  updateEquipment,
  deleteEquipment
};
