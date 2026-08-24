const { Cart, CartItem, Product, ProductImage } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getCart = async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    let whereClause = {};

    if (req.user) {
      whereClause = { userId: req.user.id };
    } else if (sessionId) {
      whereClause = { sessionId };
    } else {
      return sendSuccess(res, { items: [], subtotal: 0 });
    }

    let cart = await Cart.findOne({
      where: whereClause,
      include: [
        {
          model: CartItem,
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

    if (!cart) {
      return sendSuccess(res, { items: [], subtotal: 0 });
    }

    const subtotal = cart.items.reduce((acc, item) => {
      const price = parseFloat(item.product.salePrice || item.product.price);
      return acc + (price * item.quantity);
    }, 0);

    return sendSuccess(res, { cart, subtotal });
  } catch (error) {
    next(error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, sessionId } = req.body;

    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) {
      return sendError(res, 'Product not found or unavailable', 404);
    }

    let cart;
    if (req.user) {
      [cart] = await Cart.findOrCreate({
        where: { userId: req.user.id }
      });
    } else if (sessionId) {
      [cart] = await Cart.findOrCreate({
        where: { sessionId }
      });
    } else {
      return sendError(res, 'User authentication or session ID required', 400);
    }

    let cartItem = await CartItem.findOne({
      where: {
        cartId: cart.id,
        productId
      }
    });

    const itemPrice = parseFloat(product.salePrice || product.price);

    if (cartItem) {
      cartItem.quantity += parseInt(quantity);
      cartItem.price = itemPrice;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity: parseInt(quantity),
        price: itemPrice
      });
    }

    return sendSuccess(res, cartItem, 'Product added to cart');
  } catch (error) {
    next(error);
  }
};

const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findByPk(itemId);
    if (!cartItem) {
      return sendError(res, 'Cart item not found', 404);
    }

    if (quantity <= 0) {
      await cartItem.destroy();
      return sendSuccess(res, null, 'Item removed from cart');
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    return sendSuccess(res, cartItem, 'Cart updated successfully');
  } catch (error) {
    next(error);
  }
};

const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const cartItem = await CartItem.findByPk(itemId);

    if (!cartItem) {
      return sendError(res, 'Cart item not found', 404);
    }

    await cartItem.destroy();
    return sendSuccess(res, null, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
};
