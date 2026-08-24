import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const Product: any = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(280),
    allowNull: false,
    unique: true
  },
  sku: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  brandId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shortDescription: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  salePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lowStockThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  weight: {
    type: DataTypes.DECIMAL(8, 2), // in kg
    defaultValue: 1.0
  },
  dimensions: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  warranty: {
    type: DataTypes.STRING(100),
    defaultValue: '2 Years Manufacturer Warranty'
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  averageRating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.0
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'products',
  timestamps: true,
  indexes: [
    { fields: ['slug'] },
    { fields: ['sku'] },
    { fields: ['categoryId'] },
    { fields: ['brandId'] },
    { fields: ['price'] },
    { fields: ['isFeatured'] }
  ]
});

export default Product;
