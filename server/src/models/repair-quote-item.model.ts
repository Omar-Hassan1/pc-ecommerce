import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const RepairQuoteItem: any = sequelize.define('RepairQuoteItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  repairQuoteId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  partNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'repair_quote_items',
  timestamps: true
});

export default RepairQuoteItem;
