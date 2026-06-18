const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || process.env.MYSQLDATABASE || 'crm_management_system',
  process.env.DB_USER || process.env.MYSQLUSER || 'root',
  process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
  {
    host: process.env.DB_HOST || process.env.MYSQLHOST || '127.0.0.1',
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
    dialect: 'mysql',
    logging: false, // Set to console.log to see SQL queries
    define: {
      timestamps: false, // We handle timestamps manually or explicitly in models
      underscored: true // database fields use snake_case
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
