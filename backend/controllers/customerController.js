const { Customer, Address, Phone, Preference, CustomerStatus, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /api/customers
const getCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', statusId } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (statusId) {
      whereClause.statusId = statusId;
    }

    const { count, rows } = await Customer.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: CustomerStatus, as: 'status' },
        { model: Address, as: 'addresses' },
        { model: Phone, as: 'phones' }
      ],
      distinct: true, // ensures correct counting when includes have 1-N relationships
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/customers/:id
const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id, {
      include: [
        { model: CustomerStatus, as: 'status' },
        { model: Address, as: 'addresses' },
        { model: Phone, as: 'phones' },
        { model: Preference, as: 'preference' }
      ]
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
};

// POST /api/customers
const createCustomer = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      firstName,
      lastName,
      email,
      passwordHash = '$2a$12$K.z1oQZz2/M9mG32j1dDNu6wJqP7vS6Nq4lR8r0qB878zY/b2wIia', // default customer password hash
      statusId = 1, // default status Active
      addresses = [],
      phones = [],
      preference = { preferredLanguage: 'en', newsletterOptIn: true, marketingOptIn: true }
    } = req.body;

    if (!firstName || !lastName || !email) {
      await transaction.rollback();
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    // Check email uniqueness
    const existing = await Customer.findOne({ where: { email } });
    if (existing) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Customer with this email already exists' });
    }

    // Create Customer
    const customer = await Customer.create({
      firstName,
      lastName,
      email,
      passwordHash,
      statusId
    }, { transaction });

    // Create Addresses
    if (addresses && addresses.length > 0) {
      const addressData = addresses.map(addr => ({
        ...addr,
        customerId: customer.id
      }));
      await Address.bulkCreate(addressData, { transaction });
    }

    // Create Phones
    if (phones && phones.length > 0) {
      const phoneData = phones.map(ph => ({
        ...ph,
        customerId: customer.id
      }));
      await Phone.bulkCreate(phoneData, { transaction });
    }

    // Create Preferences
    await Preference.create({
      ...preference,
      customerId: customer.id
    }, { transaction });

    await transaction.commit();

    // Fetch newly created customer with full info
    const fullCustomer = await Customer.findByPk(customer.id, {
      include: [
        { model: CustomerStatus, as: 'status' },
        { model: Address, as: 'addresses' },
        { model: Phone, as: 'phones' },
        { model: Preference, as: 'preference' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Customer profile created successfully',
      data: fullCustomer
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// PUT /api/customers/:id
const updateCustomer = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { firstName, lastName, email, statusId, addresses, phones, preference } = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Update main customer details
    await customer.update({
      firstName: firstName || customer.firstName,
      lastName: lastName || customer.lastName,
      email: email || customer.email,
      statusId: statusId || customer.statusId
    }, { transaction });

    // Update addresses if provided
    if (addresses) {
      // For simplicity, delete old addresses and bulk create new ones
      await Address.destroy({ where: { customerId: id }, transaction });
      const addressData = addresses.map(addr => ({
        ...addr,
        customerId: id
      }));
      await Address.bulkCreate(addressData, { transaction });
    }

    // Update phones if provided
    if (phones) {
      await Phone.destroy({ where: { customerId: id }, transaction });
      const phoneData = phones.map(ph => ({
        ...ph,
        customerId: id
      }));
      await Phone.bulkCreate(phoneData, { transaction });
    }

    // Update preference if provided
    if (preference) {
      const existingPref = await Preference.findByPk(id);
      if (existingPref) {
        await existingPref.update({
          preferredLanguage: preference.preferredLanguage || existingPref.preferredLanguage,
          newsletterOptIn: preference.newsletterOptIn !== undefined ? preference.newsletterOptIn : existingPref.newsletterOptIn,
          marketingOptIn: preference.marketingOptIn !== undefined ? preference.marketingOptIn : existingPref.marketingOptIn
        }, { transaction });
      } else {
        await Preference.create({
          ...preference,
          customerId: id
        }, { transaction });
      }
    }

    await transaction.commit();

    const fullCustomer = await Customer.findByPk(id, {
      include: [
        { model: CustomerStatus, as: 'status' },
        { model: Address, as: 'addresses' },
        { model: Phone, as: 'phones' },
        { model: Preference, as: 'preference' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Customer profile updated successfully',
      data: fullCustomer
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// DELETE /api/customers/:id
const deleteCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Cascading deletes are handled by MySQL constraints & Sequelize associations on delete CASCADE
    await customer.destroy();

    res.status(200).json({
      success: true,
      message: 'Customer profile deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
