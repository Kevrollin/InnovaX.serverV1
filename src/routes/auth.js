const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { User, Student } = require('../models');
const { createToken } = require('../utils/jwt');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Create a new user account
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/signup', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').optional().trim(),
  body('phone').optional().trim(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, fullName, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already registered' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
      fullName,
      phone,
      role: 'BASE_USER',
      status: 'ACTIVE',
    });

    // Remove password hash from response
    const userJson = user.toJSON();
    delete userJson.passwordHash;

    res.status(201).json(userJson);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login and get access token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 token_type:
 *                   type: string
 *                   example: bearer
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Inactive user
 */
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(400).json({ message: 'Inactive user' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create token
    const token = createToken({ sub: user.id, username: user.username });

    res.json({
      access_token: token,
      token_type: 'bearer',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/student-register:
 *   post:
 *     summary: Register as a student
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - schoolEmail
 *               - schoolName
 *               - admissionNumber
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               schoolEmail:
 *                 type: string
 *               schoolName:
 *                 type: string
 *               admissionNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Student registered successfully
 *       400:
 *         description: Validation error
 */
router.post('/student-register', [
  body('username').trim().isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('schoolEmail').isEmail(),
  body('schoolName').trim().notEmpty(),
  body('admissionNumber').trim().notEmpty(),
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      username, email, password, fullName, phone,
      schoolEmail, schoolName, admissionNumber, idNumber, estimatedGraduationYear
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already registered' });
    }

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const existingStudent = await Student.findOne({ where: { schoolEmail } });
    if (existingStudent) {
      return res.status(400).json({ message: 'School email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      email,
      passwordHash,
      fullName,
      phone,
      role: 'STUDENT',
      status: 'ACTIVE',
    });

    // Create student profile
    await Student.create({
      userId: user.id,
      schoolEmail,
      schoolName,
      admissionNumber,
      idNumber,
      estimatedGraduationYear,
      verificationStatus: 'pending',
    });

    // Get user with student profile
    const userWithProfile = await User.findByPk(user.id, {
      include: [{ association: 'studentProfile' }],
    });

    const userJson = userWithProfile.toJSON();
    delete userJson.passwordHash;

    res.status(201).json(userJson);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', verifyToken, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ association: 'studentProfile' }],
    });

    const userJson = user.toJSON();
    delete userJson.passwordHash;

    res.json(userJson);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
router.put('/profile', verifyToken, async (req, res, next) => {
  try {
    const { fullName, phone } = req.body;

    const user = await User.findByPk(req.user.id);
    
    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;

    await user.save();

    const userJson = user.toJSON();
    delete userJson.passwordHash;

    res.json(userJson);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
