import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.config';

export const TechnicianAssignment: any = sequelize.define('TechnicianAssignment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  repairRequestId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  technicianId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  assignedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'technician_assignments',
  timestamps: true
});

export default TechnicianAssignment;
