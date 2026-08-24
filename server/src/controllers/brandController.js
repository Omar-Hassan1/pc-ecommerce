const { Brand } = require('../models');
const { sendSuccess } = require('../utils/responseHandler');
const { slugify } = require('../utils/helpers');

const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.findAll({ order: [['name', 'ASC']] });
    return sendSuccess(res, brands);
  } catch (error) {
    next(error);
  }
};

const createBrand = async (req, res, next) => {
  try {
    const { name, logo, description } = req.body;
    const slug = slugify(name);

    const brand = await Brand.create({
      name,
      slug,
      logo,
      description
    });

    return sendSuccess(res, brand, 'Brand created successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBrands,
  createBrand
};
