const { Opportunity, Lead, Product } = require('../models');
const { Op } = require('sequelize');

const getOpportunities = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, stage } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};
    if (stage) {
      whereClause.stage = stage;
    }

    const { count, rows } = await Opportunity.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [
        { model: Lead, as: 'lead' },
        { model: Product, as: 'product' }
      ],
      order: [['id', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: rows,
      meta: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getOpportunityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findByPk(id, {
      include: [
        { model: Lead, as: 'lead' },
        { model: Product, as: 'product' }
      ]
    });

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    res.status(200).json({ success: true, data: opportunity });
  } catch (error) {
    next(error);
  }
};

const createOpportunity = async (req, res, next) => {
  try {
    const { leadId, productId, amount, stage = 'Prospecting', expectedClose } = req.body;

    if (!leadId || !productId || amount === undefined) {
      return res.status(400).json({ message: 'Lead ID, Product ID, and amount are required' });
    }

    const lead = await Lead.findByPk(leadId);
    if (!lead) return res.status(400).json({ message: 'Invalid Lead ID' });

    const product = await Product.findByPk(productId);
    if (!product) return res.status(400).json({ message: 'Invalid Product ID' });

    const opportunity = await Opportunity.create({
      leadId,
      productId,
      amount,
      stage,
      expectedClose: expectedClose || null
    });

    const fullOpportunity = await Opportunity.findByPk(opportunity.id, {
      include: [
        { model: Lead, as: 'lead' },
        { model: Product, as: 'product' }
      ]
    });

    res.status(201).json({ success: true, message: 'Opportunity created successfully', data: fullOpportunity });
  } catch (error) {
    next(error);
  }
};

const updateOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { leadId, productId, amount, stage, expectedClose } = req.body;

    const opportunity = await Opportunity.findByPk(id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    if (leadId) {
      const lead = await Lead.findByPk(leadId);
      if (!lead) return res.status(400).json({ message: 'Invalid Lead ID' });
    }

    if (productId) {
      const product = await Product.findByPk(productId);
      if (!product) return res.status(400).json({ message: 'Invalid Product ID' });
    }

    await opportunity.update({
      leadId: leadId || opportunity.leadId,
      productId: productId || opportunity.productId,
      amount: amount !== undefined ? amount : opportunity.amount,
      stage: stage || opportunity.stage,
      expectedClose: expectedClose !== undefined ? expectedClose : opportunity.expectedClose
    });

    const fullOpportunity = await Opportunity.findByPk(id, {
      include: [
        { model: Lead, as: 'lead' },
        { model: Product, as: 'product' }
      ]
    });

    res.status(200).json({ success: true, message: 'Opportunity updated successfully', data: fullOpportunity });
  } catch (error) {
    next(error);
  }
};

const deleteOpportunity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const opportunity = await Opportunity.findByPk(id);

    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    await opportunity.destroy();
    res.status(200).json({ success: true, message: 'Opportunity deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
};
