const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Interaction = sequelize.define('Interaction', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  customerId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'customer_id'
  },
  employeeId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'employee_id'
  },
  type: {
    type: DataTypes.ENUM('Call', 'Email', 'Meeting', 'Note', 'Follow-up'),
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  interactedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'interacted_at'
  }
}, {
  tableName: 'customer_interactions'
});

module.exports = Interaction;
