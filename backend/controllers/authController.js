const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Employee, Role } = require('../models');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const employee = await Employee.findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }]
    });

    if (!employee || !employee.isActive) {
      return res.status(401).json({ message: 'Invalid credentials or inactive account' });
    }

    const isMatch = await bcrypt.compare(password, employee.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      id: employee.id,
      email: employee.email,
      role: employee.role.name
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'super_secret_key_change_in_production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: employee.id,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        role: employee.role.name
      }
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, roleId } = req.body;

    if (!firstName || !lastName || !email || !password || !roleId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(400).json({ message: 'Invalid role ID specified' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newEmployee = await Employee.create({
      firstName,
      lastName,
      email,
      passwordHash,
      roleId,
      isActive: false
    });

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      user: {
        id: newEmployee.id,
        firstName: newEmployee.firstName,
        lastName: newEmployee.lastName,
        email: newEmployee.email,
        role: role.name
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register
};
