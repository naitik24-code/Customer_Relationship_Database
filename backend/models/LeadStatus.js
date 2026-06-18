const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeadStatus = sequelize.define('LeadStatus', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'lead_statuses'
});

module.exports = LeadStatus;
