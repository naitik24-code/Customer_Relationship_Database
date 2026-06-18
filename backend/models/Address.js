const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Address = sequelize.define('Address', {
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
  addressLine: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'address_line'
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  zipCode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    field: 'zip_code'
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_primary'
  }
}, {
  tableName: 'customer_addresses'
});

module.exports = Address;
