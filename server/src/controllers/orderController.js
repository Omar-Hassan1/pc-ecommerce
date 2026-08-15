const { Order, OrderItem, Product, Inventory, Payment, ShippingMethod, Coupon, CouponUsage, sequelize } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { generateOrderNumber } = require('../utils/helpers');

const createOrder = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      shippingMethodId,
      couponCode,
      notes,
      guestEmail,
      guestPhone,
      paymentMethod = 'Stripe'
    } = req.body;

    if (!items || items.length === 0) {
      return sendError(res, 'Order must contain at least one item', 400);
    }

    let subtotal = 0;
    const orderItemsPayload = [];

    // Verify stock availability & calculate subtotal
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction });
      if (!product || !product.isActive) {
        await transaction.rollback();
        return sendError(res, `Product ID ${item.productId} is not available`, 400);
      }

      if (product.stockQuantity < item.quantity) {
        await transaction.rollback();
        return sendError(res, `Insufficient stock for product: ${product.name}`, 400);
      }

      const unitPrice = parseFloat(product.salePrice || product.price);
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItemsPayload.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        quantity: item.quantity,
        unitPrice,
        totalPrice: itemTotal
      });

      // Atomic stock reduction
      product.stockQuantity -= item.quantity;
      await product.save({ transaction });

      // Update inventory record
      const inventory = await Inventory.findOne({ where: { productId: product.id }, transaction });
      if (inventory) {
        inventory.stockQuantity = product.stockQuantity;
        inventory.availableQuantity = Math.max(0, inventory.stockQuantity - inventory.reservedQuantity);
        await inventory.save({ transaction });
      }
    }

    // Shipping cost calculation
    let shippingAmount = 15.00;
    if (shippingMethodId) {
      const method = await ShippingMethod.findByPk(shippingMethodId, { transaction });
      if (method) {
        shippingAmount = parseFloat(method.basePrice);
      }
    }

    // Discount calculation
    let discountAmount = 0.0;
    let validCoupon = null;
    if (couponCode) {
      validCoupon = await Coupon.findOne({
        where: { code: couponCode.toUpperCase(), isActive: true },
        transaction
      });

      if (validCoupon) {
        if (validCoupon.type === 'percentage') {
          discountAmount = (subtotal * parseFloat(validCoupon.value)) / 100;
          if (validCoupon.maxDiscount && discountAmount > parseFloat(validCoupon.maxDiscount)) {
            discountAmount = parseFloat(validCoupon.maxDiscount);
          }
        } else {
          discountAmount = parseFloat(validCoupon.value);
        }
        validCoupon.timesUsed += 1;
        await validCoupon.save({ transaction });
      }
    }

    // Tax calculation (e.g. 8%)
    const taxAmount = (subtotal - discountAmount) * 0.08;
    const totalAmount = subtotal + shippingAmount + taxAmount - discountAmount;

    const orderNumber = generateOrderNumber();
    const userId = req.user ? req.user.id : null;

    const order = await Order.create({
      orderNumber,
      userId,
      guestEmail: guestEmail || (req.user ? req.user.email : null),
      guestPhone: guestPhone || (req.user ? req.user.phone : null),
      status: 'Order Received',
      subtotal,
      shippingAmount,
      taxAmount,
      discountAmount,
      totalAmount,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      shippingMethodId,
      notes
    }, { transaction });

    // Create Order Items
    for (const itemPayload of orderItemsPayload) {
      await OrderItem.create({
        ...itemPayload,
        orderId: order.id
      }, { transaction });
    }

    // Create Payment record
    const payment = await Payment.create({
      orderId: order.id,
      paymentMethod,
      transactionId: `TXN-${Date.now()}`,
      amount: totalAmount,
      status: 'Paid' // Simulated dev payment confirmation
    }, { transaction });

    // Update order status to Payment Confirmed
    order.status = 'Payment Confirmed';
    await order.save({ transaction });

    if (validCoupon && userId) {
      await CouponUsage.create({
        couponId: validCoupon.id,
        userId,
        orderId: order.id
      }, { transaction });
    }

    await transaction.commit();

    return sendSuccess(res, { order, payment }, 'Order created successfully', 201);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        { model: OrderItem, as: 'items' },
        { model: Payment, as: 'payment' }
      ],
      order: [['createdAt', 'DESC']]
    });
    return sendSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};

const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, email } = req.query;

    const where = {};
    if (orderNumber) where.orderNumber = orderNumber.trim();

    const order = await Order.findOne({
      where,
      include: [
        { model: OrderItem, as: 'items' },
        { model: Payment, as: 'payment' },
        { model: ShippingMethod, as: 'shippingMethod' }
      ]
    });

    if (!order) {
      return sendError(res, 'Order not found with provided criteria', 404);
    }

    // Timeline stage tracking definition
    const stages = [
      'Order Received',
      'Payment Confirmed',
      'Processing',
      'Preparing Shipment',
      'Shipped',
      'In Transit',
      'Out for Delivery',
      'Delivered'
    ];

    const currentStageIndex = stages.indexOf(order.status);

    return sendSuccess(res, {
      order,
      stages,
      currentStageIndex: currentStageIndex !== -1 ? currentStageIndex : 0
    });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(id, {
      include: [{ model: OrderItem, as: 'items' }],
      transaction
    });

    if (!order) {
      await transaction.rollback();
      return sendError(res, 'Order not found', 404);
    }

    // Restock inventory if order is cancelled
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        const product = await Product.findByPk(item.productId, { transaction });
        if (product) {
          product.stockQuantity += item.quantity;
          await product.save({ transaction });

          const inventory = await Inventory.findOne({ where: { productId: product.id }, transaction });
          if (inventory) {
            inventory.stockQuantity = product.stockQuantity;
            inventory.availableQuantity = Math.max(0, inventory.stockQuantity - inventory.reservedQuantity);
            await inventory.save({ transaction });
          }
        }
      }
    }

    order.status = status;
    await order.save({ transaction });

    await transaction.commit();

    return sendSuccess(res, order, `Order status updated to ${status}`);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  trackOrder,
  updateOrderStatus
};
