import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';
import argon2 from 'argon2';
import bcrypt from 'bcryptjs';

export const User: any = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('CUSTOMER', 'TECHNICIAN', 'ADMIN', 'SUPER_ADMIN'),
    defaultValue: 'CUSTOMER'
  },
  avatar: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user: any) => {
      if (user.password && !user.password.startsWith('$argon2id$')) {
        user.password = await argon2.hash(user.password, { type: argon2.argon2id });
      }
    },
    beforeUpdate: async (user: any) => {
      if (user.changed('password') && !user.password.startsWith('$argon2id$')) {
        user.password = await argon2.hash(user.password, { type: argon2.argon2id });
      }
    }
  }
});

User.prototype.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  try {
    if (this.password && this.password.startsWith('$argon2id$')) {
      return await argon2.verify(this.password, candidatePassword);
    }
    if (this.password && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$') || this.password.startsWith('$2y$'))) {
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      if (isMatch) {
        // Gradual migration: rehash with Argon2id and update database
        const newHash = await argon2.hash(candidatePassword, { type: argon2.argon2id });
        this.password = newHash;
        await this.save();
      }
      return isMatch;
    }
    return await argon2.verify(this.password, candidatePassword);
  } catch {
    return false;
  }
};

User.prototype.toPublicJSON = function () {
  const values = { ...this.get() };
  delete values.password;
  delete values.resetPasswordToken;
  delete values.resetPasswordExpires;
  return values;
};

export default User;
