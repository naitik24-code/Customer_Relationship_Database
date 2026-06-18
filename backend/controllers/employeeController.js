const { Employee, Role } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

const getEmployees = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', roleId } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    if (roleId) {
      whereClause.roleId = roleId;
    }

    const { count, rows } = await Employee.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: Role, as: 'role' }],
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

const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id, {
      include: [{ model: Role, as: 'role' }]
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, roleId, isActive = true } = req.body;

    if (!firstName || !lastName || !email || !password || !roleId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await Employee.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(400).json({ message: 'Invalid role ID' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      passwordHash,
      roleId,
      isActive
    });

    const fullEmployee = await Employee.findByPk(employee.id, {
      include: [{ model: Role, as: 'role' }]
    });

    res.status(201).json({ success: true, message: 'Employee created successfully', data: fullEmployee });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password, roleId, isActive } = req.body;

    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (roleId) {
      const role = await Role.findByPk(roleId);
      if (!role) return res.status(400).json({ message: 'Invalid role ID' });
      updateData.roleId = roleId;
    }
    if (isActive !== undefined) updateData.isActive = isActive;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    await employee.update(updateData);

    const fullEmployee = await Employee.findByPk(id, {
      include: [{ model: Role, as: 'role' }]
    });

    res.status(200).json({ success: true, message: 'Employee updated successfully', data: fullEmployee });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.destroy();
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
