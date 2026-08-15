const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  sessionId: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'carts',
  timestamps: true
});

module.exports = Cart;
