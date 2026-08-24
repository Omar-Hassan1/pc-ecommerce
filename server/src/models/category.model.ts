import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const Category: any = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'categories',
  timestamps: true
});

export default Category;
