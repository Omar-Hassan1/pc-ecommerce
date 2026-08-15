const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CouponUsage = sequelize.define('CouponUsage', {
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

module.exports = CouponUsage;
