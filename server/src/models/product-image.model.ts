import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const ProductImage: any = sequelize.define('ProductImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'product_images',
  timestamps: true
});

export default ProductImage;
