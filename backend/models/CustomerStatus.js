const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CustomerStatus = sequelize.define('CustomerStatus', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true
  }
}, {
  tableName: 'customer_statuses'
});

module.exports = CustomerStatus;
