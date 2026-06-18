const { Ticket, Customer, Employee, Interaction } = require('../models');
const { Op } = require('sequelize');

// GET /api/tickets
const getTickets = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, priority, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};
    if (priority) whereClause.priority = priority;
    if (status) whereClause.status = status;

    const { count, rows } = await Ticket.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Employee, as: 'assignedTo', attributes: ['id', 'firstName', 'lastName', 'email'] }
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

// GET /api/tickets/:id
const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Employee, as: 'assignedTo', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// POST /api/tickets
const createTicket = async (req, res, next) => {
  try {
    const { customerId, assignedToId, priority = 'Medium', status = 'Open', subject, description } = req.body;

    if (!customerId || !subject || !description) {
      return res.status(400).json({ message: 'Customer ID, subject, and description are required' });
    }

    const customer = await Customer.findByPk(customerId);
    if (!customer) return res.status(400).json({ message: 'Invalid Customer ID' });

    if (assignedToId) {
      const employee = await Employee.findByPk(assignedToId);
      if (!employee) return res.status(400).json({ message: 'Invalid Employee ID' });
    }

    const ticket = await Ticket.create({
      customerId,
      assignedToId: assignedToId || null,
      priority,
      status,
      subject,
      description
    });

    const fullTicket = await Ticket.findByPk(ticket.id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Employee, as: 'assignedTo', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(201).json({ success: true, message: 'Ticket created successfully', data: fullTicket });
  } catch (error) {
    next(error);
  }
};

// PUT /api/tickets/:id
const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { customerId, assignedToId, priority, status, subject, description } = req.body;

    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    if (customerId) {
      const customer = await Customer.findByPk(customerId);
      if (!customer) return res.status(400).json({ message: 'Invalid Customer ID' });
    }

    if (assignedToId) {
      const employee = await Employee.findByPk(assignedToId);
      if (!employee) return res.status(400).json({ message: 'Invalid Employee ID' });
    }

    await ticket.update({
      customerId: customerId || ticket.customerId,
      assignedToId: assignedToId !== undefined ? assignedToId : ticket.assignedToId,
      priority: priority || ticket.priority,
      status: status || ticket.status,
      subject: subject || ticket.subject,
      description: description || ticket.description
    });

    const fullTicket = await Ticket.findByPk(id, {
      include: [
        { model: Customer, as: 'customer', attributes: ['id', 'firstName', 'lastName', 'email'] },
        { model: Employee, as: 'assignedTo', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(200).json({ success: true, message: 'Ticket updated successfully', data: fullTicket });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/tickets/:id
const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    await ticket.destroy();
    res.status(200).json({ success: true, message: 'Ticket deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// TICKET INTERACTIONS SUB-CONTROLLER
// ==========================================

// GET /api/tickets/:id/interactions
const getTicketInteractions = async (req, res, next) => {
  try {
    const { id } = req.params; // ticketId
    
    // Interactions for this ticket's customer
    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const interactions = await Interaction.findAll({
      where: { customerId: ticket.customerId },
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ],
      order: [['interactedAt', 'DESC']]
    });

    res.status(200).json({ success: true, data: interactions });
  } catch (error) {
    next(error);
  }
};

// POST /api/tickets/:id/interactions
const createTicketInteraction = async (req, res, next) => {
  try {
    const { id } = req.params; // ticketId
    const { type, notes } = req.body;
    const employeeId = req.user.id; // from Auth Token payload

    if (!type || !notes) {
      return res.status(400).json({ message: 'Type and notes are required' });
    }

    const ticket = await Ticket.findByPk(id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const interaction = await Interaction.create({
      customerId: ticket.customerId,
      employeeId,
      type,
      notes
    });

    const fullInteraction = await Interaction.findByPk(interaction.id, {
      include: [
        { model: Employee, as: 'employee', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ]
    });

    res.status(201).json({ success: true, message: 'Interaction logged successfully', data: fullInteraction });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketInteractions,
  createTicketInteraction
};
