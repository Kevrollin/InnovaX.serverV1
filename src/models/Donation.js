const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Donation = sequelize.define('Donation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  donorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'donor_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  recipientId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'recipient_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  projectId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'project_id',
    references: {
      model: 'projects',
      key: 'id',
    },
  },
  campaignId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'campaign_id',
    references: {
      model: 'campaigns',
      key: 'id',
    },
  },
  postId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'post_id',
    references: {
      model: 'posts',
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.DECIMAL(20, 6),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(10),
    defaultValue: 'XLM',
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('STELLAR_XLM', 'STELLAR_USDC', 'STRIPE_CARD', 'MPESA', 'BANK_TRANSFER'),
    allowNull: false,
    field: 'payment_method',
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isAnonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_anonymous',
  },
  txHash: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    field: 'tx_hash',
  },
  stellarTransactionId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    field: 'stellar_transaction_id',
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED'),
    defaultValue: 'PENDING',
    allowNull: false,
  },
  confirmedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'confirmed_at',
  },
  providerTransactionId: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'provider_transaction_id',
  },
  providerFee: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
    field: 'provider_fee',
  },
  platformFee: {
    type: DataTypes.DECIMAL(10, 6),
    allowNull: true,
    field: 'platform_fee',
  },
  metaData: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'meta_data',
  },
}, {
  tableName: 'donations',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['donor_id'] },
    { fields: ['recipient_id'] },
    { fields: ['project_id'] },
    { fields: ['campaign_id'] },
    { fields: ['post_id'] },
    { fields: ['status'] },
    { fields: ['tx_hash'] },
  ],
});

module.exports = Donation;
