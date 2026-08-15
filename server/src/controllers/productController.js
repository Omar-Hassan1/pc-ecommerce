const { Product, Category, Brand, ProductImage, ProductSpecification, Review, Inventory, sequelize } = require('../models');
const { Op } = require('sequelize');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { slugify } = require('../utils/helpers');

const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      sort = 'featured'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = { isActive: true };

    // Search filter across name, brand, category, SKU, description
    if (search) {
      where[Op.or] = [
        { name: { [Op.like || Op.iLike]: `%${search}%` } },
        { sku: { [Op.like || Op.iLike]: `%${search}%` } },
        { description: { [Op.like || Op.iLike]: `%${search}%` } }
      ];
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      where.stockQuantity = { [Op.gt]: 0 };
    }

    if (isFeatured === 'true') {
      where.isFeatured = true;
    }

    const categoryInclude = { model: Category, as: 'category' };
    if (category) {
      if (category.includes('-')) {
        categoryInclude.where = { slug: category };
      } else {
        categoryInclude.where = { [Op.or]: [{ id: category }, { slug: category }] };
      }
    }

    const brandInclude = { model: Brand, as: 'brand' };
    if (brand) {
      brandInclude.where = { [Op.or]: [{ id: brand }, { slug: brand }] };
    }

    // Sort mapping
    let order = [['isFeatured', 'DESC'], ['createdAt', 'DESC']];
    switch (sort) {
      case 'price_asc':
        order = [['price', 'ASC']];
        break;
      case 'price_desc':
        order = [['price', 'DESC']];
        break;
      case 'newest':
        order = [['createdAt', 'DESC']];
        break;
      case 'rating':
        order = [['averageRating', 'DESC']];
        break;
      case 'best_selling':
        order = [['reviewCount', 'DESC']];
        break;
      default:
        order = [['isFeatured', 'DESC'], ['createdAt', 'DESC']];
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [
        categoryInclude,
        brandInclude,
        { model: ProductImage, as: 'images' },
        { model: ProductSpecification, as: 'specifications' }
      ],
      order,
      limit: parseInt(limit),
      offset,
      distinct: true
    });

    return sendSuccess(res, {
      products,
      pagination: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;

    const product = await Product.findOne({
      where: {
        [Op.or]: [
          { slug: identifier },
          { id: identifier }
        ],
        isActive: true
      },
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: ProductImage, as: 'images' },
        { model: ProductSpecification, as: 'specifications' },
        { 
          model: Review, 
          as: 'reviews',
          include: [{ model: sequelize.models.User, as: 'user', attributes: ['firstName', 'lastName'] }] 
        }
      ]
    });

    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    // Related products from same category
    const relatedProducts = await Product.findAll({
      where: {
        categoryId: product.categoryId,
        id: { [Op.ne]: product.id },
        isActive: true
      },
      include: [
        { model: ProductImage, as: 'images' },
        { model: Brand, as: 'brand' }
      ],
      limit: 4
    });

    return sendSuccess(res, { product, relatedProducts });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      name,
      sku,
      categoryId,
      brandId,
      description,
      shortDescription,
      price,
      salePrice,
      cost,
      stockQuantity,
      lowStockThreshold,
      weight,
      dimensions,
      warranty,
      isFeatured,
      images = [],
      specifications = []
    } = req.body;

    const slug = slugify(name);

    const product = await Product.create({
      name,
      slug,
      sku: sku || `SKU-${Date.now()}`,
      categoryId,
      brandId,
      description,
      shortDescription,
      price,
      salePrice,
      cost,
      stockQuantity: stockQuantity || 0,
      lowStockThreshold: lowStockThreshold || 5,
      weight: weight || 1.0,
      dimensions,
      warranty,
      isFeatured: isFeatured || false
    }, { transaction });

    // Inventory record
    await Inventory.create({
      productId: product.id,
      stockQuantity: stockQuantity || 0,
      availableQuantity: stockQuantity || 0,
      lowStockThreshold: lowStockThreshold || 5
    }, { transaction });

    // Multi images
    if (images && images.length > 0) {
      const imageRecords = images.map((img, index) => ({
        productId: product.id,
        imageUrl: typeof img === 'string' ? img : img.imageUrl,
        isPrimary: index === 0,
        sortOrder: index
      }));
      await ProductImage.bulkCreate(imageRecords, { transaction });
    }

    // Dynamic specs
    if (specifications && specifications.length > 0) {
      const specRecords = specifications.map(spec => ({
        productId: product.id,
        specKey: spec.specKey,
        specValue: spec.specValue,
        groupName: spec.groupName || 'General'
      }));
      await ProductSpecification.bulkCreate(specRecords, { transaction });
    }

    await transaction.commit();

    const fullProduct = await Product.findByPk(product.id, {
      include: [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' },
        { model: ProductImage, as: 'images' },
        { model: ProductSpecification, as: 'specifications' }
      ]
    });

    return sendSuccess(res, fullProduct, 'Product created successfully', 201);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    await product.update(req.body);

    if (req.body.stockQuantity !== undefined) {
      await Inventory.update(
        { 
          stockQuantity: req.body.stockQuantity, 
          availableQuantity: req.body.stockQuantity 
        },
        { where: { productId: product.id } }
      );
    }

    return sendSuccess(res, product, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);

    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    // Soft archive or full delete
    product.isActive = false;
    await product.save();

    return sendSuccess(res, null, 'Product archived successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
};
