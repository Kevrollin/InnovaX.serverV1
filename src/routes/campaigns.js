const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Campaign } = require('../models');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all campaigns
router.get('/', [
  query('skip').optional().isInt({ min: 0 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], async (req, res, next) => {
  try {
    const { skip = 0, limit = 100, status, featured_only } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (featured_only === 'true') where.isFeatured = true;

    const campaigns = await Campaign.findAll({
      where,
      include: [{ association: 'creator', attributes: ['id', 'username', 'fullName'] }],
      limit: parseInt(limit),
      offset: parseInt(skip),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      campaigns,
      total: campaigns.length,
      page: Math.floor(skip / limit) + 1,
      size: limit,
      has_next: campaigns.length === limit,
    });
  } catch (error) {
    next(error);
  }
});

// Get campaign by ID
router.get('/:id', async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [{ association: 'creator', attributes: ['id', 'username', 'fullName'] }],
    });

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Increment views
    campaign.viewsCount += 1;
    await campaign.save();

    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

// Create campaign (admin only)
router.post('/', verifyToken, requireAdmin, [
  body('name').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('campaign_type').notEmpty(),
  body('reward_pool').isFloat({ min: 0 }),
  body('start_date').isISO8601(),
  body('end_date').isISO8601(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const campaign = await Campaign.create({
      ...req.body,
      createdBy: req.user.id,
      fundingRaised: 0,
    });

    res.status(201).json(campaign);
  } catch (error) {
    next(error);
  }
});

// Update campaign (admin only)
router.put('/:id', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    await campaign.update(req.body);
    
    res.json(campaign);
  } catch (error) {
    next(error);
  }
});

// Delete campaign (admin only)
router.delete('/:id', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    await campaign.destroy();
    
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
