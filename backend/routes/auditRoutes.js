const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../controllers/auditController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

// Only Admins can view audit logs
router.get('/', roleMiddleware(['Admin']), getAuditLogs);

module.exports = router;
