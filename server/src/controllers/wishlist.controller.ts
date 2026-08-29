import { Request, Response, NextFunction } from 'express';
import { Wishlist, WishlistItem, Product, ProductImage } from '../models';
import { sendSuccess } from '../utils/response.handler';

export const getWishlist = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const [wishlist] = await Wishlist.findOrCreate({
      where: { userId: req.user.id },
      include: [
        {
          model: WishlistItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              include: [{ model: ProductImage, as: 'images' }]
            }
          ]
        }
      ]
    });

    return sendSuccess(res, wishlist);
  } catch (error) {
    next(error);
  }
};

export const toggleWishlistItem = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { productId } = req.body;

    const [wishlist] = await Wishlist.findOrCreate({
      where: { userId: req.user.id }
    });

    const existingItem = await WishlistItem.findOne({
      where: {
        wishlistId: wishlist.id,
        productId
      }
    });

    if (existingItem) {
      await existingItem.destroy();
      return sendSuccess(res, { inWishlist: false }, 'Product removed from wishlist');
    } else {
      await WishlistItem.create({
        wishlistId: wishlist.id,
        productId
      });
      return sendSuccess(res, { inWishlist: true }, 'Product added to wishlist');
    }
  } catch (error) {
    next(error);
  }
};
