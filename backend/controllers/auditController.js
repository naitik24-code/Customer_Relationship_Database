const { sequelize } = require('../models');

const getAuditLogs = async (req, res, next) => {
  try {
    const [data] = await sequelize.query('SELECT * FROM audit_log ORDER BY performed_at DESC LIMIT 100');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAuditLogs
};
