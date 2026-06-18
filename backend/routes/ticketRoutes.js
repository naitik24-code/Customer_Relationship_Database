const express = require('express');
const router = express.Router();
const {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  getTicketInteractions,
  createTicketInteraction
} = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/', roleMiddleware(['Admin', 'Manager', 'Sales Executive', 'Support Agent']), getTickets);
router.get('/:id', roleMiddleware(['Admin', 'Manager', 'Sales Executive', 'Support Agent']), getTicketById);

router.post('/', roleMiddleware(['Admin', 'Manager', 'Support Agent']), createTicket);
router.put('/:id', roleMiddleware(['Admin', 'Manager', 'Support Agent']), updateTicket);
router.delete('/:id', roleMiddleware(['Admin', 'Manager']), deleteTicket);

// Nested interactions routes for Customer Interactions linked to ticket customer
router.get('/:id/interactions', roleMiddleware(['Admin', 'Manager', 'Sales Executive', 'Support Agent']), getTicketInteractions);
router.post('/:id/interactions', roleMiddleware(['Admin', 'Manager', 'Support Agent']), createTicketInteraction);

module.exports = router;
