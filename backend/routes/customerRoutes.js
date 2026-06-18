const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All customer routes require authentication
router.use(authMiddleware);

// Admin, Manager, Sales Executive, Support Agent can view customer profiles
router.get('/', roleMiddleware(['Admin', 'Manager', 'Sales Executive', 'Support Agent']), getCustomers);
router.get('/:id', roleMiddleware(['Admin', 'Manager', 'Sales Executive', 'Support Agent']), getCustomerById);

// Admin, Manager, and Sales Executive can create/update customer profiles
router.post('/', roleMiddleware(['Admin', 'Manager', 'Sales Executive']), createCustomer);
router.put('/:id', roleMiddleware(['Admin', 'Manager', 'Sales Executive']), updateCustomer);

// Only Admin and Manager can delete customer profiles
router.delete('/:id', roleMiddleware(['Admin', 'Manager']), deleteCustomer);

module.exports = router;
