const { Wishlist, WishlistItem, Product, ProductImage } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getWishlist = async (req, res, next) => {
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

const toggleWishlistItem = async (req, res, next) => {
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

module.exports = {
  getWishlist,
  toggleWishlistItem
};
