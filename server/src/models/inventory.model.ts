import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const Inventory: any = sequelize.define('Inventory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  reservedQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  availableQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  }
}, {
  tableName: 'inventory',
  timestamps: true
});

export default Inventory;
