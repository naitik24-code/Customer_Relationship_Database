const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Preference = sequelize.define('Preference', {
  customerId: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    field: 'customer_id'
  },
  preferredLanguage: {
    type: DataTypes.STRING(10),
    defaultValue: 'en',
    field: 'preferred_language'
  },
  newsletterOptIn: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'newsletter_opt_in'
  },
  marketingOptIn: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'marketing_opt_in'
  }
}, {
  tableName: 'customer_preferences'
});

module.exports = Preference;
