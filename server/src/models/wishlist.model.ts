import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const Wishlist: any = sequelize.define('Wishlist', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'wishlists',
  timestamps: true
});

export default Wishlist;
