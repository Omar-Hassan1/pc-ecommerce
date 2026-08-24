const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RepairStatusHistory = sequelize.define('RepairStatusHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  repairRequestId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  updatedBy: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'repair_status_history',
  timestamps: true
});

module.exports = RepairStatusHistory;
