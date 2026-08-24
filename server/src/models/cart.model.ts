import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const Cart: any = sequelize.define('Cart', {
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

export default Cart;
