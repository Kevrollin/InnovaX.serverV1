const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wallet = sequelize.define('Wallet', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  publicKey: {
    type: DataTypes.STRING(56),
    allowNull: false,
    unique: true,
    field: 'public_key',
  },
  secretKeyEncrypted: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'secret_key_encrypted',
  },
  isConnected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_connected',
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_verified',
  },
  xlmBalance: {
    type: DataTypes.DECIMAL(20, 6),
    defaultValue: 0,
    field: 'xlm_balance',
  },
  usdcBalance: {
    type: DataTypes.DECIMAL(20, 6),
    defaultValue: 0,
    field: 'usdc_balance',
  },
  lastBalanceUpdate: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_balance_update',
  },
  connectedVia: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'connected_via',
  },
  connectionMetadata: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'connection_metadata',
  },
  lastUsed: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'last_used',
  },
}, {
  tableName: 'wallets',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['public_key'] },
  ],
});

module.exports = Wallet;
