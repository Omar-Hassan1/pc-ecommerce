const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RepairFile = sequelize.define('RepairFile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  repairRequestId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  fileUrl: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  fileType: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'repair_files',
  timestamps: true
});

module.exports = RepairFile;
