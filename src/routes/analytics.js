const express = require('express');
const { query } = require('express-validator');
const { User, Project, Donation, Campaign } = require('../models');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get platform analytics
router.get('/platform', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalProjects = await Project.count();
    const totalDonations = await Donation.count();
    const totalCampaigns = await Campaign.count();
    
    const totalAmount = await Donation.sum('amount', { where: { status: 'CONFIRMED' } });
    
    // Active projects (published or fundable)
    const activeProjects = await Project.count({
      where: {
        status: ['published', 'fundable', 'funded'],
      },
    });

    res.json({
      total_users: totalUsers,
      total_projects: totalProjects,
      active_projects: activeProjects,
      total_donations: totalDonations,
      total_campaigns: totalCampaigns,
      total_amount_raised: totalAmount || 0,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
