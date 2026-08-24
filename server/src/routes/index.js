const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const brandRoutes = require('./brandRoutes');
const cartRoutes = require('./cartRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const orderRoutes = require('./orderRoutes');
const paymentRoutes = require('./paymentRoutes');
const shippingRoutes = require('./shippingRoutes');
const couponRoutes = require('./couponRoutes');
const reviewRoutes = require('./reviewRoutes');
const repairRoutes = require('./repairRoutes');
const technicianRoutes = require('./technicianRoutes');
const adminRoutes = require('./adminRoutes');
const pcBuilderRoutes = require('./pcBuilderRoutes');
const contactRoutes = require('./contactRoutes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/brands', brandRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/shipping', shippingRoutes);
router.use('/coupons', couponRoutes);
router.use('/reviews', reviewRoutes);
router.use('/repairs', repairRoutes);
router.use('/technician', technicianRoutes);
router.use('/admin', adminRoutes);
router.use('/pc-builder', pcBuilderRoutes);
router.use('/contact', contactRoutes);

module.exports = router;
