import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const ProductSpecification: any = sequelize.define('ProductSpecification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  specKey: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  specValue: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  groupName: {
    type: DataTypes.STRING(100),
    defaultValue: 'General'
  }
}, {
  tableName: 'product_specifications',
  timestamps: true
});

export default ProductSpecification;
