import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { UnauthorizedError, ForbiddenError } from '../errors';

export const protect = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new UnauthorizedError('Not authorized, token missing'));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'nexora_super_secret_jwt_key_2026_computers_platform'
    ) as { id: string };

    const user = await (User as any).findByPk(decoded.id);

    if (!user || !user.isActive) {
      return next(new UnauthorizedError('User account is invalid or deactivated'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new UnauthorizedError('Not authorized, token invalid or expired'));
  }
};

// Role-based authorization middleware
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError(`User role '${req.user.role}' is not authorized to access this route`)
      );
    }

    next();
  };
};
