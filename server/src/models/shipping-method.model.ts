import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const ShippingMethod: any = sequelize.define('ShippingMethod', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  estimatedDays: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  basePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 15.00
  },
  pricePerKg: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 2.50
  },
  isInternational: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'shipping_methods',
  timestamps: true
});

export default ShippingMethod;
