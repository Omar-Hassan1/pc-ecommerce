import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const ContactMessage: any = sequelize.define('ContactMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  subject: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('NEW', 'IN_PROGRESS', 'RESOLVED'),
    defaultValue: 'NEW'
  }
}, {
  tableName: 'contact_messages',
  timestamps: true
});

export default ContactMessage;
