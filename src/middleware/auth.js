const jwt = require('jsonwebtoken');
const config = require('../config');
const { User, Student } = require('../models');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    const decoded = jwt.verify(token, config.security.secretKey);
    
    const user = await User.findByPk(decoded.sub || decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ message: 'User is not active' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};

const requireAdmin = requireRole('ADMIN');
const requireStudent = requireRole('STUDENT', 'ADMIN');

// Middleware to verify that user is a verified student
const requireVerifiedStudent = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const student = await Student.findOne({
      where: { userId: req.user.id, verificationStatus: 'verified' }
    });

    if (!student) {
      return res.status(403).json({ message: 'You must be a verified student to perform this action' });
    }

    req.verifiedStudent = student;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Error verifying student status' });
  }
};

module.exports = {
  verifyToken,
  requireRole,
  requireAdmin,
  requireStudent,
  requireVerifiedStudent,
};
