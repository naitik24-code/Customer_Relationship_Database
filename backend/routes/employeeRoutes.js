const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} = require('../controllers/employeeController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Only Admin and Manager can manage employees list
router.get('/', roleMiddleware(['Admin', 'Manager']), getEmployees);
router.get('/:id', roleMiddleware(['Admin', 'Manager']), getEmployeeById);

router.post('/', roleMiddleware(['Admin']), createEmployee);
router.put('/:id', roleMiddleware(['Admin', 'Manager']), updateEmployee);
router.delete('/:id', roleMiddleware(['Admin']), deleteEmployee);

module.exports = router;
