const { Coupon } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const validateCoupon = async (req, res, next) => {
  try {
    const { code, subtotal = 0 } = req.body;

    if (!code) {
      return sendError(res, 'Coupon code is required', 400);
    }

    const coupon = await Coupon.findOne({
      where: { code: code.toUpperCase(), isActive: true }
    });

    if (!coupon) {
      return sendError(res, 'Invalid or expired coupon code', 404);
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return sendError(res, 'Coupon code has expired', 400);
    }

    if (coupon.timesUsed >= coupon.usageLimit) {
      return sendError(res, 'Coupon usage limit reached', 400);
    }

    if (subtotal < parseFloat(coupon.minPurchase)) {
      return sendError(res, `Minimum purchase of $${coupon.minPurchase} required for this coupon`, 400);
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

const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    return sendSuccess(res, coupons);
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    return sendSuccess(res, coupon, 'Coupon created successfully', 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCoupon,
  getCoupons,
  createCoupon
};
