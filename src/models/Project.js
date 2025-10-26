const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'owner_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shortDescription: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'short_description',
  },
  repoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'repo_url',
  },
  demoUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'demo_url',
  },
  websiteUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'website_url',
  },
  screenshots: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  videos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  documents: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  fundingGoal: {
    type: DataTypes.DECIMAL(20, 6),
    allowNull: false,
    field: 'funding_goal',
  },
  fundingRaised: {
    type: DataTypes.DECIMAL(20, 6),
    defaultValue: 0,
    field: 'funding_raised',
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'XLM',
    allowNull: false,
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  difficultyLevel: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'difficulty_level',
  },
  milestones: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'FUNDABLE', 'FUNDED', 'COMPLETED', 'ARCHIVED'),
    defaultValue: 'DRAFT',
    allowNull: false,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_featured',
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_public',
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'views_count',
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'likes_count',
  },
  sharesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'shares_count',
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'published_at',
  },
}, {
  tableName: 'projects',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['owner_id'] },
    { fields: ['title'] },
    { fields: ['status'] },
  ],
});

module.exports = Project;
