import { z } from 'zod';

export const getProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(12).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.enum(['true', 'false'] as const).optional(),
  isFeatured: z.enum(['true', 'false'] as const).optional(),
  sort: z.enum(['featured', 'price_asc', 'price_desc', 'newest', 'rating', 'best_selling'] as const).optional()
});

export const productIdentifierParamsSchema = z.object({
  identifier: z.string().min(1, 'Identifier parameter is required')
});

export const productIdParamsSchema = z.object({
  id: z.string().min(1, 'Product ID parameter is required')
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  sku: z.string().trim().optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
  brandId: z.string().min(1, 'Brand ID is required'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.number().min(0, 'Price must be non-negative'),
  salePrice: z.number().min(0, 'Sale price must be non-negative').optional(),
  cost: z.number().min(0).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  lowStockThreshold: z.number().int().min(0).optional(),
  weight: z.number().min(0).optional(),
  dimensions: z.string().optional(),
  warranty: z.string().optional(),
  isFeatured: z.boolean().optional(),
  images: z.array(z.union([
    z.string().url('Image must be a valid URL'),
    z.object({
      imageUrl: z.string(),
      isPrimary: z.boolean().optional(),
      sortOrder: z.number().optional()
    })
  ])).optional(),
  specifications: z.array(z.object({
    specKey: z.string().min(1),
    specValue: z.string().min(1),
    groupName: z.string().optional()
  })).optional()
});

export const updateProductSchema = createProductSchema.partial();
