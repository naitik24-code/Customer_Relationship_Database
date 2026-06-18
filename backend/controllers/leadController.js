const { Lead, LeadSource, LeadStatus, Employee, Customer, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /api/leads
const getLeads = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', sourceId, statusId, assignedToId } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    if (sourceId) whereClause.sourceId = sourceId;
    if (statusId) whereClause.statusId = statusId;
    if (assignedToId) whereClause.assignedToId = assignedToId;

    const { count, rows } = await Lead.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: LeadSource, as: 'source' },
        { model: LeadStatus, as: 'status' },
        { model: Employee, as: 'assignedTo', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Customer, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ],
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

// GET /api/leads/:id
const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByPk(id, {
      include: [
        { model: LeadSource, as: 'source' },
        { model: LeadStatus, as: 'status' },
        { model: Employee, as: 'assignedTo', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Customer, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.status(200).json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

// POST /api/leads
const createLead = async (req, res, next) => {
  try {
    const { title, description, sourceId, statusId, assignedToId } = req.body;

    if (!title || !sourceId || !statusId) {
      return res.status(400).json({ message: 'Title, sourceId, and statusId are required' });
    }

    const lead = await Lead.create({
      title,
      description,
      sourceId,
      statusId,
      assignedToId: assignedToId || null
    });

    const fullLead = await Lead.findByPk(lead.id, {
      include: [
        { model: LeadSource, as: 'source' },
        { model: LeadStatus, as: 'status' },
        { model: Employee, as: 'assignedTo', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(201).json({ success: true, message: 'Lead created successfully', data: fullLead });
  } catch (error) {
    next(error);
  }
};

// PUT /api/leads/:id
const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, sourceId, statusId, assignedToId } = req.body;

    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.update({
      title: title || lead.title,
      description: description !== undefined ? description : lead.description,
      sourceId: sourceId || lead.sourceId,
      statusId: statusId || lead.statusId,
      assignedToId: assignedToId !== undefined ? assignedToId : lead.assignedToId
    });

    const fullLead = await Lead.findByPk(id, {
      include: [
        { model: LeadSource, as: 'source' },
        { model: LeadStatus, as: 'status' },
        { model: Employee, as: 'assignedTo', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Customer, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(200).json({ success: true, message: 'Lead updated successfully', data: fullLead });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/leads/:id
const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByPk(id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await lead.destroy();
    res.status(200).json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// POST /api/leads/:id/convert (Convert Lead to Customer via Stored Procedure)
const convertLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, statusId = 1 } = req.body; // statusId = 1 is 'Active'

    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required for customer creation' });
    }

    const lead = await Lead.findByPk(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    if (lead.customerId) {
      return res.status(400).json({ message: 'Lead is already converted to a customer' });
    }

    // Default password hash for newly converted customer
    const passwordHash = '$2a$12$K.z1oQZz2/M9mG32j1dDNu6wJqP7vS6Nq4lR8r0qB878zY/b2wIia'; // "Password@123"

    // Execute stored procedure
    // In MySQL: sp_convert_lead_to_customer(lead_id, first_name, last_name, email, password_hash, status_id, OUT customer_id)
    await sequelize.query(
      'CALL sp_convert_lead_to_customer(:leadId, :firstName, :lastName, :email, :passwordHash, :statusId, @out_customer_id)',
      {
        replacements: {
          leadId: lead.id,
          firstName,
          lastName,
          email,
          passwordHash,
          statusId
        }
      }
    );

    // Retrieve the generated customer ID
    const [result] = await sequelize.query('SELECT @out_customer_id AS customerId');
    const customerId = result[0].customerId;

    if (!customerId) {
      return res.status(500).json({ message: 'Stored procedure failed to return a new customer ID' });
    }

    const customer = await Customer.findByPk(customerId, {
      include: [
        { model: Address, as: 'addresses' },
        { model: Phone, as: 'phones' },
        { model: Preference, as: 'preference' }
      ]
    });

    res.status(200).json({
      success: true,
      message: 'Lead converted successfully using stored procedure',
      data: {
        leadId: lead.id,
        customerId: customer.id,
        customer
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  convertLead
};
