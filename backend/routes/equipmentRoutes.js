const express = require('express');
const router = express.Router();
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment
} = require('../controllers/equipmentController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.route('/')
  .get(getEquipment)
  .post(protect, authorizeRoles('owner', 'admin'), createEquipment);

router.route('/:id')
  .get(getEquipmentById)
  .put(protect, authorizeRoles('owner', 'admin'), updateEquipment)
  .delete(protect, authorizeRoles('owner', 'admin'), deleteEquipment);

module.exports = router;
