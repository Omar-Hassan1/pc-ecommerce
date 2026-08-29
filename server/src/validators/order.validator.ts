import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0).optional()
  })).min(1, 'Order must contain at least one item'),
  shippingAddress: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().optional(),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required')
  }),
  billingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().optional(),
    postalCode: z.string().min(1),
    country: z.string().min(1)
  }).optional(),
  shippingMethodId: z.string().optional(),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
  guestEmail: z.string().email().optional(),
  guestPhone: z.string().optional(),
  paymentMethod: z.string().optional()
});

export const trackOrderQuerySchema = z.object({
  orderNumber: z.string().optional(),
  email: z.string().email().optional()
});

export const orderIdParamsSchema = z.object({
  id: z.string().min(1, 'Order ID is required')
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    'Order Received',
    'Payment Confirmed',
    'Processing',
    'Preparing Shipment',
    'Shipped',
    'In Transit',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ] as const),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional()
});
