import express from 'express';

import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import categoryRoutes from './category.routes';
import brandRoutes from './brand.routes';
import cartRoutes from './cart.routes';
import wishlistRoutes from './wishlist.routes';
import orderRoutes from './order.routes';
import paymentRoutes from './payment.routes';
import shippingRoutes from './shipping.routes';
import couponRoutes from './coupon.routes';
import reviewRoutes from './review.routes';
import repairRoutes from './repair.routes';
import technicianRoutes from './technician.routes';
import adminRoutes from './admin.routes';
import pcBuilderRoutes from './pc-builder.routes';
import contactRoutes from './contact.routes';

const router = express.Router();

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

export default router;
