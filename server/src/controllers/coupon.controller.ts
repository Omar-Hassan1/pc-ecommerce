import { Request, Response, NextFunction } from 'express';
import { Coupon } from '../models';
import { sendSuccess } from '../utils/response.handler';
import { BadRequestError, NotFoundError } from '../errors';

export const validateCoupon = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code) {
      throw new BadRequestError('Coupon code is required');
    }

    const coupon = await Coupon.findOne({
      where: { code: code.toUpperCase(), isActive: true }
    });

    if (!coupon) {
      throw new NotFoundError('Invalid or expired coupon code');
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      throw new BadRequestError('Coupon code has expired');
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      throw new BadRequestError('Coupon usage limit reached');
    }

    if (subtotal < parseFloat(coupon.minPurchase)) {
      throw new BadRequestError(`Minimum purchase of $${coupon.minPurchase} required for this coupon`);
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal * parseFloat(coupon.value)) / 100;
      if (coupon.maxDiscount && discount > parseFloat(coupon.maxDiscount)) {
        discount = parseFloat(coupon.maxDiscount);
      }
    } else {
      discount = parseFloat(coupon.value);
    }

    return sendSuccess(res, {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount: Math.round(discount * 100) / 100
    }, 'Coupon applied successfully');
  } catch (error) {
    next(error);
  }
};

export const getCoupons = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    return sendSuccess(res, coupons);
  } catch (error) {
    next(error);
  }
};

export const createCoupon = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const coupon = await Coupon.create(req.body);
    return sendSuccess(res, coupon, 'Coupon created successfully', 201);
  } catch (error) {
    next(error);
  }
};
