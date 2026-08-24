const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RepairRequest = sequelize.define('RepairRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  repairNumber: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true // Allow guest repair requests
  },
  customerName: {
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
    allowNull: false
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  deviceType: {
    type: DataTypes.ENUM('Laptop', 'Desktop PC', 'Gaming PC', 'Mac', 'Other'),
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  serialNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  problemCategory: {
    type: DataTypes.ENUM(
      'Does not turn on',
      'Overheating',
      'Broken screen',
      'Slow performance',
      'Blue screen',
      'Storage problem',
      'Battery problem',
      'Keyboard problem',
      'GPU problem',
      'Internet/Wi-Fi problem',
      'Virus/Malware',
      'Data recovery',
      'Upgrade request',
      'Other'
    ),
    allowNull: false
  },
  problemDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  hasBeenRepairedBefore: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM(
      'Request Submitted',
      'Waiting for Device',
      'Device Received',
      'Initial Inspection',
      'Diagnostics',
      'Quote Prepared',
      'Waiting for Customer Approval',
      'Repair Approved',
      'Repair In Progress',
      'Testing',
      'Repair Completed',
      'Preparing Return Shipment',
      'Shipped',
      'Delivered',
      'Cancelled'
    ),
    defaultValue: 'Request Submitted'
  },
  technicianNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'repair_requests',
  timestamps: true,
  indexes: [
    { fields: ['repairNumber'] },
    { fields: ['email'] },
    { fields: ['status'] }
  ]
});

module.exports = RepairRequest;
