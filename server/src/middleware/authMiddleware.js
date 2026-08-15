const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendError } = require('../utils/responseHandler');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized, token missing', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nexora_super_secret_jwt_key_2026_computers_platform');
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      return sendError(res, 'User account is invalid or deactivated', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 'Not authorized, token invalid or expired', 401);
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Not authenticated', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, `User role '${req.user.role}' is not authorized to access this route`, 403);
    }

    next();
  };
};

module.exports = { protect, authorize };
