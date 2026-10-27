import Category from '../models/Category.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      res.status(400);
      throw new Error('Category name is required');
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      res.status(400);
      throw new Error('Category already exists');
    }

    const category = await Category.create({
      name,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      category,
      message: 'Category created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    await category.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
