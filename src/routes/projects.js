const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Project, User, Student } = require('../models');
const { verifyToken, requireVerifiedStudent } = require('../middleware/auth');
const router = express.Router();

// Get all projects
router.get('/', [
  query('skip').optional().isInt({ min: 0 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], async (req, res, next) => {
  try {
    const { skip = 0, limit = 100, status, category, search, featured_only } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (featured_only === 'true') where.isFeatured = true;

    const projects = await Project.findAll({
      where,
      include: [{ association: 'owner', attributes: ['id', 'username', 'fullName'] }],
      limit: parseInt(limit),
      offset: parseInt(skip),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      projects,
      total: projects.length,
      page: Math.floor(skip / limit) + 1,
      size: limit,
      has_next: projects.length === limit,
    });
  } catch (error) {
    next(error);
  }
});

// Get project by ID
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, {
      include: [
        { association: 'owner', attributes: ['id', 'username', 'fullName'] },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Increment views
    project.viewsCount += 1;
    await project.save();

    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Create project (only verified students)
router.post('/', verifyToken, requireVerifiedStudent, [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('fundingGoal').isFloat({ min: 0 }),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.create({
      ...req.body,
      ownerId: req.user.id,
      fundingGoal: req.body.fundingGoal,
      fundingRaised: 0,
      status: 'fundable', // Projects from verified students are fundable by default
    });

    const createdProject = await Project.findByPk(project.id, {
      include: [{ association: 'owner', attributes: ['id', 'username', 'fullName'] }],
    });

    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
});

// Update project
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not enough permissions' });
    }

    await project.update(req.body);
    
    res.json(project);
  } catch (error) {
    next(error);
  }
});

// Delete project
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not enough permissions' });
    }

    await project.destroy();
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
