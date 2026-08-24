import { Request } from 'express';

export interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  password?: string;
  role: 'CUSTOMER' | 'TECHNICIAN' | 'ADMIN' | 'SUPER_ADMIN';
  avatar?: string | null;
  isActive: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthenticatedRequest extends Request {
  user?: any; // Sequelize User instance or UserAttributes
  file?: any;
  files?: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
