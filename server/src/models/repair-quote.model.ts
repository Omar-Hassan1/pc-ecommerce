import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const RepairQuote: any = sequelize.define('RepairQuote', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  repairRequestId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  diagnosticFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  laborCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  shippingCost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'APPROVED', 'REJECTED'),
    defaultValue: 'PENDING'
  },
  customerDecision: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'repair_quotes',
  timestamps: true
});

export default RepairQuote;
