const { sendError } = require('../utils/responseHandler');

const notFoundHandler = (req, res, next) => {
  return sendError(res, `Route not found - ${req.originalUrl}`, 404);
};

const globalErrorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err);

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors ? err.errors.map(e => e.message) : [err.message];
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

module.exports = { notFoundHandler, globalErrorHandler };
