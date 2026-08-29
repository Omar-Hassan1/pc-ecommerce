import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.handler';
import logger from '../config/logger.config';

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): Response => {
  return sendError(res, `Route not found - ${req.originalUrl}`, 404);
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  logger.error({ err, path: req.originalUrl, method: req.method }, '[Error Handler]');

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors ? err.errors.map((e: any) => e.message) : [err.message];
    return sendError(res, 'Validation Error', 400, messages);
  }

  // JWT error
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication Token Error', 401);
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal Server Error' 
    : (err.message || 'Server Exception');

  return sendError(res, message, statusCode);
};
