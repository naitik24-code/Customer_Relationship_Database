const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Opportunity = sequelize.define('Opportunity', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  leadId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'lead_id'
  },
  productId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    field: 'product_id'
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false
  },
  stage: {
    type: DataTypes.ENUM('Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'),
    defaultValue: 'Prospecting'
  },
  expectedClose: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'expected_close'
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
  tableName: 'opportunities'
});

module.exports = Opportunity;
