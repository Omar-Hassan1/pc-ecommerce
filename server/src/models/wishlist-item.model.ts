import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const WishlistItem: any = sequelize.define('WishlistItem', {
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

export default WishlistItem;
