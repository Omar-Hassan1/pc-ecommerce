import { z } from 'zod';

export const submitRepairSchema = z.object({
  customerName: z.string().trim().min(1, 'Customer name is required'),
  email: z.string().trim().email('Valid email is required'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  country: z.string().optional(),
  deviceType: z.string().trim().min(1, 'Device type is required'),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  problemCategory: z.string().optional(),
  problemDescription: z.string().trim().min(1, 'Problem description is required'),
  hasBeenRepairedBefore: z.boolean().optional()
});

export const trackRepairQuerySchema = z.object({
  repairNumber: z.string().optional(),
  email: z.string().email().optional()
});

export const quoteIdParamsSchema = z.object({
  quoteId: z.string().min(1, 'Quote ID is required')
});

export const quoteDecisionSchema = z.object({
  decision: z.enum(['ACCEPTED', 'REJECTED'] as const),
  notes: z.string().optional()
});

export const repairIdParamsSchema = z.object({
  repairId: z.string().min(1, 'Repair ID is required')
});

export const sendRepairMessageSchema = z.object({
  message: z.string().trim().min(1, 'Message text is required'),
  senderRole: z.string().optional()
});

export const updateRepairStatusSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  comment: z.string().optional()
});

export const createQuoteSchema = z.object({
  diagnosticFee: z.number().min(0, 'Diagnostic fee must be 0 or greater'),
  laborCost: z.number().min(0, 'Labor cost must be 0 or greater'),
  shippingCost: z.number().min(0).optional().default(0),
  parts: z.array(z.object({
    description: z.string().min(1, 'Part description is required'),
    partNumber: z.string().optional(),
    quantity: z.number().int().min(1, 'Part quantity must be at least 1'),
    unitPrice: z.number().min(0, 'Unit price must be 0 or greater')
  })).optional()
});
