const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Campaign = sequelize.define('Campaign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'created_by',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  name: {
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
  campaignType: {
    type: DataTypes.ENUM('HACKATHON', 'BURSARY', 'RESEARCH_GRANT', 'INNOVATION_CHALLENGE', 'GENERAL_FUNDING'),
    allowNull: false,
    field: 'campaign_type',
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  rewardPool: {
    type: DataTypes.DECIMAL(20, 6),
    allowNull: false,
    field: 'reward_pool',
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
  eligibilityCriteria: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'eligibility_criteria',
  },
  evaluationCriteria: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'evaluation_criteria',
  },
  disbursementRules: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'disbursement_rules',
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_date',
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_date',
  },
  submissionDeadline: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'submission_deadline',
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'),
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
  bannerImage: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'banner_image',
  },
  logoImage: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'logo_image',
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'views_count',
  },
  applicationsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'applications_count',
  },
  donationsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'donations_count',
  },
  publishedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'published_at',
  },
}, {
  tableName: 'campaigns',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['created_by'] },
    { fields: ['name'] },
    { fields: ['status'] },
  ],
});

module.exports = Campaign;
