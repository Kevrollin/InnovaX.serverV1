const express = require('express');
const { query, body, validationResult } = require('express-validator');
const { Student, User } = require('../models');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get student status by user ID
router.get('/:userId/status', verifyToken, async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    if (req.user.role !== 'ADMIN' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Not enough permissions' });
    }

    const student = await Student.findOne({
      where: { userId },
      include: [{ association: 'user', attributes: ['id', 'username', 'fullName', 'email'] }],
    });

    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
});

// Get pending verifications (admin only)
router.get('/pending-verification', verifyToken, requireAdmin, [
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

// Verify student (admin only)
router.post('/verify', verifyToken, requireAdmin, [
  body('user_id').isInt(),
  body('approve').isBoolean(),
  body('message').optional().trim(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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

    // If approved, update user role to student
    if (approve) {
      const user = await User.findByPk(user_id);
      if (user && user.role !== 'STUDENT') {
        user.role = 'STUDENT';
        await user.save();
      }
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
