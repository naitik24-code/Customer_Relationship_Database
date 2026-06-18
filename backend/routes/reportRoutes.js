const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getMonthlyRevenueReport,
  getCustomerGrowthReport,
  getLeadConversionReport,
  getTicketResolutionReport
} = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Only Admin and Manager can view reports and analytical charts
router.get('/stats', roleMiddleware(['Admin', 'Manager']), getDashboardStats);
router.get('/revenue', roleMiddleware(['Admin', 'Manager']), getMonthlyRevenueReport);
router.get('/growth', roleMiddleware(['Admin', 'Manager']), getCustomerGrowthReport);
router.get('/lead-conversion', roleMiddleware(['Admin', 'Manager']), getLeadConversionReport);
router.get('/ticket-resolution', roleMiddleware(['Admin', 'Manager']), getTicketResolutionReport);

module.exports = router;
