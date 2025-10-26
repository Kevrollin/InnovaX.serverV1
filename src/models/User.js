const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    unique: true,
    allowNull: false,
  },
  passwordHash: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'password_hash',
  },
  fullName: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'full_name',
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'profile_picture',
  },
  role: {
    type: DataTypes.ENUM('GUEST', 'BASE_USER', 'STUDENT', 'ADMIN', 'INSTITUTION', 'SPONSOR'),
    defaultValue: 'BASE_USER',
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'SUSPENDED'),
    defaultValue: 'ACTIVE',
    allowNull: false,
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'email_verified',
  },
  emailVerificationToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'email_verification_token',
  },
  passwordResetToken: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'password_reset_token',
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'password_reset_expires',
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_login',
  },
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['username'] },
    { fields: ['email'] },
  ],
});

// Instance methods
User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

User.prototype.hashPassword = async function(password) {
  const bcrypt = require('bcryptjs');
  const config = require('../config/index');
  return bcrypt.hash(password, config.security.bcryptRounds);
};

module.exports = User;
