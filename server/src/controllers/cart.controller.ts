import { Request, Response, NextFunction } from 'express';
import { Cart, CartItem, Product, ProductImage } from '../models';
import { sendSuccess } from '../utils/response.handler';
import { NotFoundError, BadRequestError } from '../errors';

export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { sessionId } = req.query as { sessionId?: string };
    let whereClause: any = {};

    if (req.user) {
      whereClause = { userId: req.user.id };
    } else if (sessionId) {
      whereClause = { sessionId };
    } else {
      return sendSuccess(res, { items: [], subtotal: 0 });
    }

    const cart = await Cart.findOne({
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

    const subtotal = cart.items.reduce((acc: number, item: any) => {
      const price = parseFloat(item.product.salePrice || item.product.price);
      return acc + (price * item.quantity);
    }, 0);

    return sendSuccess(res, { cart, subtotal });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { productId, quantity = 1, sessionId } = req.body;

    const product = await Product.findByPk(productId);
    if (!product || !product.isActive) {
      throw new NotFoundError('Product not found or unavailable');
    }

    let cart: any;
    if (req.user) {
      [cart] = await Cart.findOrCreate({
        where: { userId: req.user.id }
      });
    } else if (sessionId) {
      [cart] = await Cart.findOrCreate({
        where: { sessionId }
      });
    } else {
      throw new BadRequestError('User authentication or session ID required');
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

export const updateCartItem = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cartItem = await CartItem.findByPk(itemId);
    if (!cartItem) {
      throw new NotFoundError('Cart item not found');
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

export const removeCartItem = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { itemId } = req.params;
    const cartItem = await CartItem.findByPk(itemId);

    if (!cartItem) {
      throw new NotFoundError('Cart item not found');
    }

    await cartItem.destroy();
    return sendSuccess(res, null, 'Item removed from cart');
  } catch (error) {
    next(error);
  }
};
