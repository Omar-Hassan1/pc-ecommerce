const { Review, Product, User } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const createReview = async (req, res, next) => {
  try {
    const { productId, rating, title, comment } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return sendError(res, 'Product not found', 404);
    }

    const review = await Review.create({
      productId,
      userId: req.user.id,
      rating: parseInt(rating),
      title,
      comment,
      isVerifiedPurchase: true,
      isApproved: true
    });

    // Update product average rating & review count
    const reviews = await Review.findAll({ where: { productId, isApproved: true } });
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / reviews.length;

    product.averageRating = Math.round(avgRating * 10) / 10;
    product.reviewCount = reviews.length;
    await product.save();

    return sendSuccess(res, review, 'Review submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.findAll({
      where: { productId, isApproved: true },
      include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
      order: [['createdAt', 'DESC']]
    });
    return sendSuccess(res, reviews);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getProductReviews
};
