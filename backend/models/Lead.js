const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lead = sequelize.define('Lead', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  sourceId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'source_id'
  },
  statusId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'status_id'
  },
  assignedToId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'assigned_to_id'
  },
  customerId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
    field: 'customer_id'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at'
  }
}, {
  tableName: 'leads'
});

module.exports = Lead;
