const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RepairMessage = sequelize.define('RepairMessage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  repairRequestId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  senderName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  senderRole: {
    type: DataTypes.ENUM('CUSTOMER', 'TECHNICIAN', 'ADMIN'),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  attachmentUrl: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  isInternal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'repair_messages',
  timestamps: true
});

module.exports = RepairMessage;
