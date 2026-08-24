import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const CouponUsage: any = sequelize.define('CouponUsage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  couponId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  orderId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'coupon_usage',
  timestamps: true
});

export default CouponUsage;
