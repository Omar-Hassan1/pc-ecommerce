import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const NewsletterSubscriber: any = sequelize.define('NewsletterSubscriber', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'newsletter_subscribers',
  timestamps: true
});

export default NewsletterSubscriber;
