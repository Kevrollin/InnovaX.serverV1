const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Donation, User, Project, Post, Campaign } = require('../models');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Optional authentication middleware
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  verifyToken(req, res, next);
};

// Get all donations
router.get('/', optionalAuth, [
  query('skip').optional().isInt({ min: 0 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], async (req, res, next) => {
  try {
    const { skip = 0, limit = 100, donor_id, recipient_id, project_id, post_id, campaign_id, status } = req.query;
    
    const where = {};
    if (donor_id) where.donorId = donor_id;
    if (recipient_id) where.recipientId = recipient_id;
    if (project_id) where.projectId = project_id;
    if (post_id) where.postId = post_id;
    if (campaign_id) where.campaignId = campaign_id;
    if (status) where.status = status;

    const donations = await Donation.findAll({
      where,
      include: [
        { association: 'donor', attributes: ['id', 'username', 'fullName'] },
        { association: 'recipient', attributes: ['id', 'username', 'fullName'] },
        { association: 'project', attributes: ['id', 'title'] },
        { association: 'post', attributes: ['id', 'title'] },
      ],
      limit: parseInt(limit),
      offset: parseInt(skip),
      order: [['createdAt', 'DESC']],
    });

    // Authorization check
    if (!req.user || req.user.role !== 'ADMIN') {
      // Filter donations for anonymous or non-admin users
      donations = donations.filter(donation => {
        if (donation.status === 'confirmed') return true;
        if (req.user) {
          return donation.donorId === req.user.id || donation.recipientId === req.user.id;
        }
        return false;
      });
    }

    res.json({
      donations,
      total: donations.length,
      page: Math.floor(skip / limit) + 1,
      size: limit,
      has_next: donations.length === limit,
    });
  } catch (error) {
    next(error);
  }
});

// Initiate donation (optional auth for anonymous donations)
router.post('/initiate', optionalAuth, [
  body('amount').isFloat({ min: 0.01 }),
  body('currency').optional().isString(),
  body('payment_method').notEmpty(),
  body('project_id').optional().isInt(),
  body('post_id').optional().isInt(),
  body('campaign_id').optional().isInt(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { project_id, post_id, campaign_id } = req.body;

    if (!project_id && !post_id && !campaign_id) {
      return res.status(400).json({ message: 'Either project_id, post_id, or campaign_id must be provided' });
    }

    // If funding a post, verify it's fundable
    if (post_id) {
      const post = await Post.findByPk(post_id);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      if (!post.isFundable) {
        return res.status(403).json({ message: 'This post is not eligible for funding' });
      }
    }

    // If funding a project, verify it's fundable
    if (project_id) {
      const project = await Project.findByPk(project_id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      if (project.status !== 'fundable' && project.status !== 'published') {
        return res.status(403).json({ message: 'This project is not eligible for funding' });
      }
    }

    const donation = await Donation.create({
      ...req.body,
      donorId: req.user ? req.user.id : null,
      recipientId: req.user ? req.user.id : null, // Will be updated based on project/post owner
      status: 'PENDING',
    });

    res.status(201).json(donation);
  } catch (error) {
    next(error);
  }
});

// Verify donation
router.post('/verify', [
  body('donation_id').isInt(),
  body('tx_hash').notEmpty(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { donation_id, tx_hash } = req.body;

    const donation = await Donation.findByPk(donation_id);
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.txHash = tx_hash;
    donation.status = 'confirmed';
    donation.confirmedAt = new Date();
    await donation.save();

    res.json(donation);
  } catch (error) {
    next(error);
  }
});

// Get donation stats
router.get('/stats', async (req, res, next) => {
  try {
    const total = await Donation.count();
    const confirmed = await Donation.count({ where: { status: 'CONFIRMED' } });
    const totalAmount = await Donation.sum('amount', { where: { status: 'CONFIRMED' } });

    res.json({
      total,
      confirmed,
      total_amount: totalAmount || 0,
    });
  } catch (error) {
    next(error);
  }
});

// Get donation by ID (optional auth)
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const donation = await Donation.findByPk(req.params.id, {
      include: [
        { association: 'donor', attributes: ['id', 'username', 'fullName'] },
        { association: 'recipient', attributes: ['id', 'username', 'fullName'] },
        { association: 'project', attributes: ['id', 'title'] },
      ],
    });

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Authorization check
    if (!req.user || req.user.role !== 'ADMIN') {
      if (donation.status !== 'confirmed' && 
          (!req.user || (donation.donorId !== req.user.id && donation.recipientId !== req.user.id))) {
        return res.status(403).json({ message: 'Not enough permissions' });
      }
    }

    res.json(donation);
  } catch (error) {
    next(error);
  }
});

// Get donations by project
router.get('/project/:projectId', async (req, res, next) => {
  try {
    const donations = await Donation.findAll({
      where: { projectId: req.params.projectId },
      include: [{ association: 'donor', attributes: ['id', 'username', 'fullName'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(donations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
