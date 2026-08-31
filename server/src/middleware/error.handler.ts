import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError, NotFoundError } from '../errors';
import { sendError } from '../utils/response.handler';
import logger from '../config/logger.config';

/**
 * 404 Route Not Found Middleware
 */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new NotFoundError(`Route not found - ${req.originalUrl}`));
};

/**
 * Centralized HTTP Error Handler Middleware
 */
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  // 1. Custom Application Error (AppError and subclasses)
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err, path: req.originalUrl, method: req.method }, `[AppError ${err.statusCode}] ${err.message}`);
    } else {
      logger.warn({ path: req.originalUrl, method: req.method, code: err.code }, `[AppError ${err.statusCode}] ${err.message}`);
    }
    return sendError(res, err.message, err.statusCode, err.details, err.code);
  }

  // 2. Zod Schema Validation Error
  if (err instanceof ZodError || err?.name === 'ZodError') {
    const issues = err.issues || err.errors || [];
    const errorMessages = issues.map((issue: any) => {
      const path = issue.path && issue.path.length > 0 ? issue.path.join('.') : '';
      return path ? `${path}: ${issue.message}` : issue.message;
    });
    logger.warn({ path: req.originalUrl, method: req.method, errors: errorMessages }, '[Validation Error]');
    return sendError(res, 'Validation Error', 400, errorMessages, 'VALIDATION_ERROR');
  }

  // 3. Sequelize Unique Constraint Error (409 Conflict)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors ? err.errors.map((e: any) => e.message) : [err.message];
    logger.warn({ path: req.originalUrl, method: req.method, messages }, '[Sequelize Unique Constraint Error]');
    return sendError(res, 'Duplicate resource entry', 409, messages, 'CONFLICT');
  }

  // 4. Sequelize Validation Error (400 Bad Request)
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors ? err.errors.map((e: any) => e.message) : [err.message];
    logger.warn({ path: req.originalUrl, method: req.method, messages }, '[Sequelize Validation Error]');
    return sendError(res, 'Database Validation Error', 400, messages, 'VALIDATION_ERROR');
  }

  // 5. Sequelize Foreign Key Constraint Error (400 Bad Request)
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    logger.warn({ path: req.originalUrl, method: req.method, table: err.table }, '[Sequelize Foreign Key Error]');
    return sendError(
      res,
      'Referenced entity does not exist or has active dependencies',
      400,
      null,
      'FOREIGN_KEY_CONSTRAINT'
    );
  }

  // 6. Sequelize Connection & Database Execution Errors (500 Internal Server Error)
  if (
    err.name === 'SequelizeDatabaseError' ||
    err.name === 'SequelizeConnectionError' ||
    err.name === 'SequelizeConnectionRefusedError' ||
    err.name === 'SequelizeAccessDeniedError' ||
    err.name === 'SequelizeHostNotFoundError' ||
    err.name === 'SequelizeHostNotReachableError'
  ) {
    logger.error(
      {
        path: req.originalUrl,
        method: req.method,
        errorName: err.name,
        errorMessage: err.message
      },
      '[Sequelize Database Error]'
    );
    return sendError(res, 'Database operation failed', 500, null, 'DATABASE_ERROR');
  }

  // 7. JWT Authentication / Token Errors (401 Unauthorized)
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    logger.warn({ path: req.originalUrl, method: req.method, errorName: err.name }, '[JWT Auth Error]');
    return sendError(res, 'Authentication token is invalid or expired', 401, null, 'UNAUTHORIZED');
  }

  // 8. Express JSON Body Syntax Error (400 Bad Request)
  if (err instanceof SyntaxError && (err as any).status === 400 && 'body' in err) {
    logger.warn({ path: req.originalUrl, method: req.method }, '[JSON Syntax Error]');
    return sendError(res, 'Malformed JSON payload', 400, null, 'BAD_REQUEST');
  }

  // 9. Unexpected Internal Errors (500 Internal Server Error)
  logger.error({ err, path: req.originalUrl, method: req.method }, '[Unhandled Exception]');

  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const safeMessage = process.env.NODE_ENV === 'production'
    ? 'Internal Server Error'
    : (err.message || 'Internal Server Error');

  return sendError(res, safeMessage, statusCode, null, 'INTERNAL_SERVER_ERROR');
};
