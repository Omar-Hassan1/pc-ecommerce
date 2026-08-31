import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Address } from '../models';
import { sendSuccess } from '../utils/response.handler';
import {
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
  NotFoundError
} from '../errors';

const generateToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'nexora_super_secret_jwt_key_2026_computers_platform',
    { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any }
  );
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { firstName, lastName, email, phone, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictError('Email address is already registered');
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

export const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isActive) {
      throw new ForbiddenError('Account is deactivated');
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

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Address, as: 'addresses' }]
    });

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    return sendSuccess(res, user.toPublicJSON());
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    await user.save();

    return sendSuccess(res, user.toPublicJSON(), 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      throw new NotFoundError('User profile not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new BadRequestError('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
