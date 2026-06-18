const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LeadSource = sequelize.define('LeadSource', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'lead_sources'
});

module.exports = LeadSource;
