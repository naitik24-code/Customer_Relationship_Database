const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const leadRoutes = require('./routes/leadRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const productRoutes = require('./routes/productRoutes');
const opportunityRoutes = require('./routes/opportunityRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const reportRoutes = require('./routes/reportRoutes');
const auditRoutes = require('./routes/auditRoutes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

const path = require('path');

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve React static files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/audit', auditRoutes);

// Fallback to React app for non-API routes (React Router support)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Error Handling Middleware
app.use(errorHandler);

module.exports = app;
