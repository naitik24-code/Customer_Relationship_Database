const sequelize = require('../config/database');
const Role = require('./Role');
const Permission = require('./Permission');
const Employee = require('./Employee');
const CustomerStatus = require('./CustomerStatus');
const Customer = require('./Customer');
const Address = require('./Address');
const Phone = require('./Phone');
const Preference = require('./Preference');
const LeadSource = require('./LeadSource');
const LeadStatus = require('./LeadStatus');
const Lead = require('./Lead');
const ProductCategory = require('./ProductCategory');
const Product = require('./Product');
const Opportunity = require('./Opportunity');
const Ticket = require('./Ticket');
const Interaction = require('./Interaction');

// ==========================================
// Role & Permission Associations (M-N)
// ==========================================
Role.belongsToMany(Permission, {
  through: 'role_permissions',
  foreignKey: 'role_id',
  otherKey: 'permission_id',
  timestamps: false
});
Permission.belongsToMany(Role, {
  through: 'role_permissions',
  foreignKey: 'permission_id',
  otherKey: 'role_id',
  timestamps: false
});

// ==========================================
// Employee & Role Associations (1-N)
// ==========================================
Role.hasMany(Employee, { foreignKey: 'role_id', as: 'employees' });
Employee.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// ==========================================
// Customer & CustomerStatus Associations (1-N)
// ==========================================
CustomerStatus.hasMany(Customer, { foreignKey: 'status_id', as: 'customers' });
Customer.belongsTo(CustomerStatus, { foreignKey: 'status_id', as: 'status' });

// ==========================================
// Customer Sub-Entities (Addresses, Phones, Preferences)
// ==========================================
Customer.hasMany(Address, { foreignKey: 'customer_id', as: 'addresses', onDelete: 'CASCADE' });
Address.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.hasMany(Phone, { foreignKey: 'customer_id', as: 'phones', onDelete: 'CASCADE' });
Phone.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Customer.hasOne(Preference, { foreignKey: 'customer_id', as: 'preference', onDelete: 'CASCADE' });
Preference.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// ==========================================
// Lead Associations
// ==========================================
LeadSource.hasMany(Lead, { foreignKey: 'source_id', as: 'leads' });
Lead.belongsTo(LeadSource, { foreignKey: 'source_id', as: 'source' });

LeadStatus.hasMany(Lead, { foreignKey: 'status_id', as: 'leads' });
Lead.belongsTo(LeadStatus, { foreignKey: 'status_id', as: 'status' });

Employee.hasMany(Lead, { foreignKey: 'assigned_to_id', as: 'assignedLeads' });
Lead.belongsTo(Employee, { foreignKey: 'assigned_to_id', as: 'assignedTo' });

Customer.hasMany(Lead, { foreignKey: 'customer_id', as: 'leads' });
Lead.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

// ==========================================
// Product Associations
// ==========================================
ProductCategory.hasMany(Product, { foreignKey: 'category_id', as: 'products' });
Product.belongsTo(ProductCategory, { foreignKey: 'category_id', as: 'category' });

// Customer & Product M-N purchased relation
Customer.belongsToMany(Product, {
  through: 'customer_products',
  foreignKey: 'customer_id',
  otherKey: 'product_id',
  as: 'purchasedProducts',
  timestamps: false
});
Product.belongsToMany(Customer, {
  through: 'customer_products',
  foreignKey: 'product_id',
  otherKey: 'customer_id',
  as: 'customers',
  timestamps: false
});

// ==========================================
// Opportunity Associations
// ==========================================
Lead.hasMany(Opportunity, { foreignKey: 'lead_id', as: 'opportunities', onDelete: 'CASCADE' });
Opportunity.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });

Product.hasMany(Opportunity, { foreignKey: 'product_id', as: 'opportunities' });
Opportunity.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// ==========================================
// Ticket Associations
// ==========================================
Customer.hasMany(Ticket, { foreignKey: 'customer_id', as: 'tickets', onDelete: 'CASCADE' });
Ticket.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Employee.hasMany(Ticket, { foreignKey: 'assigned_to_id', as: 'assignedTickets' });
Ticket.belongsTo(Employee, { foreignKey: 'assigned_to_id', as: 'assignedTo' });

// ==========================================
// Interaction Associations
// ==========================================
Customer.hasMany(Interaction, { foreignKey: 'customer_id', as: 'interactions', onDelete: 'CASCADE' });
Interaction.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });

Employee.hasMany(Interaction, { foreignKey: 'employee_id', as: 'interactions' });
Interaction.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

module.exports = {
  sequelize,
  Role,
  Permission,
  Employee,
  CustomerStatus,
  Customer,
  Address,
  Phone,
  Preference,
  LeadSource,
  LeadStatus,
  Lead,
  ProductCategory,
  Product,
  Opportunity,
  Ticket,
  Interaction
};
