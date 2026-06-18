const express = require('express');
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunityController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/', roleMiddleware(['Admin', 'Manager', 'Sales Executive']), getOpportunities);
router.get('/:id', roleMiddleware(['Admin', 'Manager', 'Sales Executive']), getOpportunityById);

router.post('/', roleMiddleware(['Admin', 'Manager', 'Sales Executive']), createOpportunity);
router.put('/:id', roleMiddleware(['Admin', 'Manager', 'Sales Executive']), updateOpportunity);
router.delete('/:id', roleMiddleware(['Admin', 'Manager']), deleteOpportunity);

module.exports = router;
