const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public / Authenticated
const getCategories = async (req, res) => {
  try {
    const categories = await Category.getAll();
    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching categories'
    });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public / Authenticated
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }
    return res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching category'
    });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private (Admin only)
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    if (name.trim().length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Category name cannot exceed 50 characters'
      });
    }

    // Check duplicate category name
    const existing = await Category.findByName(name.trim());
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Category with name '${name.trim()}' already exists`
      });
    }

    const created = await Category.create({
      name: name.trim(),
      description: description ? description.trim() : ''
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: created
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating category'
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin only)
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;

    const existing = await Category.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Category name cannot be empty'
        });
      }

      if (name.trim().length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Category name cannot exceed 50 characters'
        });
      }

      // Check duplicate name
      const duplicate = await Category.findByName(name.trim());
      if (duplicate && String(duplicate.id) !== String(id)) {
        return res.status(400).json({
          success: false,
          message: `Category with name '${name.trim()}' already exists`
        });
      }
    }

    const updated = await Category.update(id, {
      name: name !== undefined ? name.trim() : existing.name,
      description: description !== undefined ? description.trim() : existing.description
    });

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating category'
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin only)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Category.findById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    await Category.delete(id);

    return res.status(200).json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting category'
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};
