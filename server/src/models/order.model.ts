import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const Order: any = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderNumber: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true // Allow guest orders with email details
  },
  guestEmail: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  guestPhone: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM(
      'Order Received',
      'Payment Confirmed',
      'Processing',
      'Preparing Shipment',
      'Shipped',
      'In Transit',
      'Out for Delivery',
      'Delivered',
      'Cancelled',
      'Refunded'
    ),
    defaultValue: 'Order Received'
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  taxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  shippingAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  discountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.0
  },
  shippingAddress: {
    type: DataTypes.JSON, // Stores snapshot of shipping address
    allowNull: false
  },
  billingAddress: {
    type: DataTypes.JSON, // Stores snapshot of billing address
    allowNull: true
  },
  shippingMethodId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  indexes: [
    { fields: ['orderNumber'] },
    { fields: ['userId'] },
    { fields: ['status'] }
  ]
});

export default Order;
