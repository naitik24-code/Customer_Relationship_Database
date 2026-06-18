const express = require('express');
const router = express.Router();
const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  convertLead
} = require('../controllers/leadController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/', roleMiddleware(['Admin', 'Manager', 'Sales Executive']), getLeads);
router.get('/:id', roleMiddleware(['Admin', 'Manager', 'Sales Executive']), getLeadById);

router.post('/', roleMiddleware(['Admin', 'Manager', 'Sales Executive']), createLead);
router.put('/:id', roleMiddleware(['Admin', 'Manager', 'Sales Executive']), updateLead);

// Lead Conversion using stored procedure
router.post('/:id/convert', roleMiddleware(['Admin', 'Manager', 'Sales Executive']), convertLead);

router.delete('/:id', roleMiddleware(['Admin', 'Manager']), deleteLead);

module.exports = router;
