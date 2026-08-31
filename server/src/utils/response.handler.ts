import { Response } from 'express';

/**
 * Standardized API response wrappers
 */
export const sendSuccess = (
  res: Response,
  data: any = {},
  message: string | null = null,
  statusCode = 200
): Response => {
  const payload: Record<string, any> = {
    success: true,
    ...(message && { message }),
    data
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message = 'Internal Server Error',
  statusCode = 500,
  errors: any = null,
  code?: string
): Response => {
  const payload: Record<string, any> = {
    success: false,
    message,
    ...(code && { code }),
    ...(errors && { errors })
  };
  return res.status(statusCode).json(payload);
};

