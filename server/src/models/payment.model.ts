import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const Payment: any = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    defaultValue: 'Stripe'
  },
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'USD'
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Failed', 'Refunded', 'Partially Refunded'),
    defaultValue: 'Pending'
  },
  paymentDetails: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true
});

export default Payment;
