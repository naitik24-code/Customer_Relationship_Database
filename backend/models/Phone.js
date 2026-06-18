const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Phone = sequelize.define('Phone', {
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
  phoneNumber: {
    type: DataTypes.STRING(30),
    allowNull: false,
    field: 'phone_number'
  },
  type: {
    type: DataTypes.ENUM('mobile', 'work', 'home', 'other'),
    defaultValue: 'mobile'
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_primary'
  }
}, {
  tableName: 'customer_phones'
});

module.exports = Phone;
