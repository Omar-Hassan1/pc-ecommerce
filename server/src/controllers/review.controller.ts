import { Request, Response, NextFunction } from 'express';
import { Review, Product, User } from '../models';
import { sendSuccess, sendError } from '../utils/response.handler';

export const createReview = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
    const totalRating = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
    const avgRating = totalRating / reviews.length;

    product.averageRating = Math.round(avgRating * 10) / 10;
    product.reviewCount = reviews.length;
    await product.save();

    return sendSuccess(res, review, 'Review submitted successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getProductReviews = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
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
