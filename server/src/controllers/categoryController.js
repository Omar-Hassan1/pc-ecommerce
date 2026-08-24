const { Category } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { slugify } = require('../utils/helpers');

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { parentId: null },
      include: [{ model: Category, as: 'subcategories' }]
    });
    return sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, parentId, icon } = req.body;
    const slug = slugify(name);

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      parentId,
      icon
    });

    return sendSuccess(res, category, 'Category created successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory
};
