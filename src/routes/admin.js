const express = require('express');
const { query, validationResult } = require('express-validator');
const { User, Project, Donation, Student, ActivityLog } = require('../models');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get admin stats
router.get('/stats', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const totalUsers = await User.count();
    const totalStudents = await User.count({ where: { role: 'STUDENT' } });
    const totalProjects = await Project.count();
    const totalDonations = await Donation.count();
    const totalAmount = await Donation.sum('amount', { where: { status: 'CONFIRMED' } });
    const pendingVerifications = await Student.count({ where: { verificationStatus: 'pending' } });

    res.json({
      total_users: totalUsers,
      total_students: totalStudents,
      total_projects: totalProjects,
      total_donations: totalDonations,
      total_amount: totalAmount || 0,
      pending_verifications: pendingVerifications,
    });
  } catch (error) {
    next(error);
  }
});

// Get verification queue
router.get('/verifications', verifyToken, requireAdmin, [
  query('skip').optional().isInt({ min: 0 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], async (req, res, next) => {
  try {
    const { skip = 0, limit = 100 } = req.query;

    const students = await Student.findAll({
      where: { verificationStatus: 'pending' },
      include: [{ association: 'user', attributes: ['id', 'username', 'fullName', 'email'] }],
      limit: parseInt(limit),
      offset: parseInt(skip),
      order: [['createdAt', 'ASC']],
    });

    res.json(students);
  } catch (error) {
    next(error);
  }
});

// Verify student
router.post('/verify-student', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { user_id, approve, message } = req.body;

    const student = await Student.findOne({ where: { userId: user_id } });
    
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    student.verificationStatus = approve ? 'approved' : 'rejected';
    student.verificationMessage = message;
    student.verifiedBy = req.user.id;
    student.verifiedAt = new Date();
    await student.save();

    res.json({ message: 'Student verification updated successfully' });
  } catch (error) {
    next(error);
  }
});

// Get activity logs
router.get('/logs', verifyToken, requireAdmin, async (req, res, next) => {
  try {
    const { skip = 0, limit = 100 } = req.query;

    const logs = await ActivityLog.findAll({
      include: [{ association: 'user', attributes: ['id', 'username', 'fullName'] }],
      limit: parseInt(limit),
      offset: parseInt(skip),
      order: [['createdAt', 'DESC']],
    });

    res.json(logs);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
