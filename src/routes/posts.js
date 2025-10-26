const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { Post, User, Student } = require('../models');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// Helper function to check if user is a verified student
async function isVerifiedStudent(userId) {
  const student = await Student.findOne({
    where: { userId, verificationStatus: 'verified' }
  });
  return !!student;
}

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of posts to skip
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of posts to return
 *       - in: query
 *         name: postType
 *         schema:
 *           type: string
 *           enum: [insights, achievements, trends, announcements]
 *         description: Filter by post type
 *       - in: query
 *         name: isFundable
 *         schema:
 *           type: boolean
 *         description: Filter by fundability
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 total:
 *                   type: integer
 */
router.get('/', [
  query('skip').optional().isInt({ min: 0 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
], async (req, res, next) => {
  try {
    const { skip = 0, limit = 100, postType, isFundable, authorId } = req.query;
    
    const where = { status: 'published' };
    if (postType) where.postType = postType;
    if (isFundable !== undefined) where.isFundable = isFundable === 'true';
    if (authorId) where.authorId = authorId;

    const posts = await Post.findAll({
      where,
      include: [{ 
        association: 'author', 
        attributes: ['id', 'username', 'fullName', 'profilePicture', 'role'] 
      }],
      limit: parseInt(limit),
      offset: parseInt(skip),
      order: [['createdAt', 'DESC']],
    });

    res.json({
      posts,
      total: posts.length,
      page: Math.floor(skip / limit) + 1,
      size: limit,
      has_next: posts.length === limit,
    });
  } catch (error) {
    next(error);
  }
});

// Get post by ID
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { 
          association: 'author', 
          attributes: ['id', 'username', 'fullName', 'profilePicture', 'role'] 
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Increment views
    post.viewsCount += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               postType:
 *                 type: string
 *                 enum: [insights, achievements, trends, announcements]
 *               mediaUrl:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', verifyToken, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('postType').optional().isIn(['insights', 'achievements', 'trends', 'announcements']),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user is a verified student
    const verifiedStudent = await isVerifiedStudent(req.user.id);

    const post = await Post.create({
      ...req.body,
      authorId: req.user.id,
      isFundable: verifiedStudent, // Only verified students can create fundable posts
    });

    const createdPost = await Post.findByPk(post.id, {
      include: [{ 
        association: 'author', 
        attributes: ['id', 'username', 'fullName', 'profilePicture', 'role'] 
      }],
    });

    res.status(201).json(createdPost);
  } catch (error) {
    next(error);
  }
});

// Update post
router.put('/:id', verifyToken, async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not enough permissions' });
    }

    // Check if user is still a verified student when updating isFundable
    if (req.body.isFundable !== undefined) {
      const verifiedStudent = await isVerifiedStudent(req.user.id);
      if (!verifiedStudent) {
        req.body.isFundable = false;
      }
    }

    await post.update(req.body);
    
    const updatedPost = await Post.findByPk(post.id, {
      include: [{ 
        association: 'author', 
        attributes: ['id', 'username', 'fullName', 'profilePicture', 'role'] 
      }],
    });

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});

// Delete post
router.delete('/:id', verifyToken, async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not enough permissions' });
    }

    await post.destroy();
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Like post
router.post('/:id/like', verifyToken, async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.likesCount += 1;
    await post.save();
    
    res.json({ message: 'Post liked successfully', likesCount: post.likesCount });
  } catch (error) {
    next(error);
  }
});

// Share post
router.post('/:id/share', verifyToken, async (req, res, next) => {
  try {
    const post = await Post.findByPk(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.sharesCount += 1;
    await post.save();
    
    res.json({ message: 'Post shared successfully', sharesCount: post.sharesCount });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
