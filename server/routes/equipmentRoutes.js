const express = require('express');
const router = express.Router();
const {
  addEquipment,
  getAllEquipment,
  getEquipmentById,
  getMyEquipment,
  updateEquipment,
  deleteEquipment
} = require('../controllers/equipmentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { uploadSingleImage } = require('../middleware/uploadMiddleware');

// @route   GET /api/equipment (Public - Get all equipment)
// @route   POST /api/equipment (Protected - Owner & Admin only)
router.route('/')
  .get(getAllEquipment)
  .post(protect, authorizeRoles('owner', 'admin'), uploadSingleImage('image'), addEquipment);

// @route   GET /api/equipment/my (Protected - Owner & Admin only)
// Declared BEFORE /:id to prevent route shadowing
router.get('/my', protect, authorizeRoles('owner', 'admin'), getMyEquipment);

// @route   GET /api/equipment/:id (Public - Get equipment by ID)
// @route   PUT /api/equipment/:id (Protected - Owner & Admin only)
// @route   DELETE /api/equipment/:id (Protected - Owner & Admin only)
router.route('/:id')
  .get(getEquipmentById)
  .put(protect, authorizeRoles('owner', 'admin'), uploadSingleImage('image'), updateEquipment)
  .delete(protect, authorizeRoles('owner', 'admin'), deleteEquipment);

module.exports = router;
