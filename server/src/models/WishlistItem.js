const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WishlistItem = sequelize.define('WishlistItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  wishlistId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  tableName: 'wishlist_items',
  timestamps: true
});

module.exports = WishlistItem;
