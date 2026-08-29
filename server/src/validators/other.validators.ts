import { z } from 'zod';

// Category Schemas
export const createCategorySchema = z.object({
  name: z.string().trim().min(1, 'Category name is required'),
  description: z.string().optional(),
  parentId: z.string().optional()
});

// Brand Schemas
export const createBrandSchema = z.object({
  name: z.string().trim().min(1, 'Brand name is required'),
  description: z.string().optional(),
  logoUrl: z.string().optional()
});

// Wishlist Schemas
export const toggleWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID is required')
});

// Payment Schemas
export const createPaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().optional().default('usd'),
  orderId: z.string().optional()
});

// Shipping Schemas
export const calculateShippingSchema = z.object({
  methodId: z.string().min(1, 'Shipping method ID is required'),
  totalWeight: z.number().min(0).optional(),
  country: z.string().optional()
});

// Coupon Schemas
export const validateCouponSchema = z.object({
  code: z.string().trim().min(1, 'Coupon code is required'),
  subtotal: z.number().min(0, 'Subtotal must be non-negative')
});

export const createCouponSchema = z.object({
  code: z.string().trim().min(1, 'Coupon code is required'),
  type: z.enum(['percentage', 'fixed'] as const),
  value: z.number().positive('Coupon value must be greater than 0'),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  usageLimit: z.number().int().min(1).optional(),
  expiresAt: z.string().optional()
});

// Review Schemas
export const reviewProductIdParamsSchema = z.object({
  productId: z.string().min(1, 'Product ID is required')
});

export const createReviewSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  title: z.string().optional(),
  comment: z.string().optional()
});

// Contact Schemas
export const submitContactSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Valid email address is required'),
  subject: z.string().trim().min(1, 'Subject is required'),
  message: z.string().trim().min(1, 'Message content is required')
});

export const subscribeNewsletterSchema = z.object({
  email: z.string().trim().email('Valid email address is required')
});

// PC Builder Schemas
export const builderComponentsQuerySchema = z.object({
  category: z.string().optional()
});

export const validateBuildSchema = z.object({
  componentIds: z.array(z.string().min(1)).min(1, 'At least one component ID is required')
});
