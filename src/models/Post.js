const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Post = sequelize.define('Post', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'author_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  mediaUrl: {
    type: DataTypes.JSON,
    allowNull: true,
    field: 'media_url',
    defaultValue: [],
  },
  postType: {
    type: DataTypes.ENUM('insights', 'achievements', 'trends', 'announcements'),
    allowNull: false,
    field: 'post_type',
    defaultValue: 'insights',
  },
  isFundable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_fundable',
  },
  likesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'likes_count',
  },
  commentsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'comments_count',
  },
  sharesCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'shares_count',
  },
  viewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'views_count',
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_public',
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'published',
    allowNull: false,
  },
}, {
  tableName: 'posts',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['author_id'] },
    { fields: ['is_fundable'] },
    { fields: ['post_type'] },
    { fields: ['created_at'] },
  ],
});

module.exports = Post;
