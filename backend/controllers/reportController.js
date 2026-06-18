const { sequelize } = require('../models');

const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Total Customers
    const [totalCustomersResult] = await sequelize.query('SELECT COUNT(*) AS count FROM customers');
    const totalCustomers = totalCustomersResult[0].count;

    // 2. Active Leads (Leads that are NOT Converted or Lost)
    const [activeLeadsResult] = await sequelize.query(
      'SELECT COUNT(*) AS count FROM leads WHERE status_id NOT IN (SELECT id FROM lead_statuses WHERE name IN ("Converted", "Lost"))'
    );
    const activeLeads = activeLeadsResult[0].count;

    // 3. Open Opportunities (Opportunities where stage is NOT Closed Won or Closed Lost)
    const [openOppsResult] = await sequelize.query(
      'SELECT COUNT(*) AS count FROM opportunities WHERE stage NOT IN ("Closed Won", "Closed Lost")'
    );
    const openOpportunities = openOppsResult[0].count;

    // 4. Closed Deals (Opportunities where stage is Closed Won)
    const [closedDealsResult] = await sequelize.query(
      'SELECT COUNT(*) AS count FROM opportunities WHERE stage = "Closed Won"'
    );
    const closedDeals = closedDealsResult[0].count;

    // 5. Total Revenue Generated (Sum of amount for Closed Won opportunities)
    const [revenueResult] = await sequelize.query(
      'SELECT SUM(amount) AS sum FROM opportunities WHERE stage = "Closed Won"'
    );
    const totalRevenue = revenueResult[0].sum || 0;

    // 6. Open Tickets (Tickets where status is Open or In Progress)
    const [openTicketsResult] = await sequelize.query(
      'SELECT COUNT(*) AS count FROM tickets WHERE status IN ("Open", "In Progress")'
    );
    const openTickets = openTicketsResult[0].count;

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeLeads,
        openOpportunities,
        closedDeals,
        totalRevenue,
        openTickets
      }
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyRevenueReport = async (req, res, next) => {
  try {
    const [data] = await sequelize.query('SELECT * FROM v_monthly_revenue');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getCustomerGrowthReport = async (req, res, next) => {
  try {
    const [data] = await sequelize.query('SELECT * FROM v_customer_growth');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getLeadConversionReport = async (req, res, next) => {
  try {
    const [data] = await sequelize.query('SELECT * FROM v_lead_conversion');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

const getTicketResolutionReport = async (req, res, next) => {
  try {
    const [data] = await sequelize.query('SELECT * FROM v_ticket_resolution');
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getMonthlyRevenueReport,
  getCustomerGrowthReport,
  getLeadConversionReport,
  getTicketResolutionReport
};
