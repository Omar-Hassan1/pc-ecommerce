import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const Address: any = sequelize.define('Address', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  addressLine1: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  addressLine2: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  postalCode: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  addressType: {
    type: DataTypes.ENUM('SHIPPING', 'BILLING', 'BOTH'),
    defaultValue: 'BOTH'
  }
}, {
  tableName: 'addresses',
  timestamps: true
});

export default Address;
