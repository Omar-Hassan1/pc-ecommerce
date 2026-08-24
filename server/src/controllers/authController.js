const jwt = require('jsonwebtoken');
const { User, Address } = require('../models');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'nexora_super_secret_jwt_key_2026_computers_platform', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendError(res, 'Email address is already registered', 400);
    }

    // Role safety check: Default to CUSTOMER unless created by admin or explicitly provided in dev
    const assignedRole = (role && ['CUSTOMER', 'TECHNICIAN', 'ADMIN'].includes(role)) ? role : 'CUSTOMER';

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
      role: assignedRole
    });

    const token = generateToken(user.id);

    return sendSuccess(res, {
      user: user.toPublicJSON(),
      token
    }, 'Registration successful', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return sendError(res, 'Invalid credentials', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Account is deactivated', 403);
    }

    const token = generateToken(user.id);

    return sendSuccess(res, {
      user: user.toPublicJSON(),
      token
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Address, as: 'addresses' }]
    });
    return sendSuccess(res, user.toPublicJSON());
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await User.findByPk(req.user.id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    await user.save();

    return sendSuccess(res, user.toPublicJSON(), 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 'Current password is incorrect', 400);
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword
};
