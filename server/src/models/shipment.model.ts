import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const Shipment: any = sequelize.define('Shipment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  shippingMethodId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  carrier: {
    type: DataTypes.STRING(100),
    defaultValue: 'DHL Express International'
  },
  status: {
    type: DataTypes.STRING(50),
    defaultValue: 'Preparing'
  },
  shippedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  estimatedDelivery: {
    type: DataTypes.DATE,
    allowNull: true
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'shipments',
  timestamps: true
});

export default Shipment;
