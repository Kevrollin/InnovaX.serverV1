const User = require('./User');
const Student = require('./Student');
const Project = require('./Project');
const Post = require('./Post');
const Donation = require('./Donation');
const Campaign = require('./Campaign');
const Wallet = require('./Wallet');
const ActivityLog = require('./ActivityLog');

// Define relationships
User.hasOne(Student, { foreignKey: 'userId', as: 'studentProfile' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Project, { foreignKey: 'ownerId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Donation, { foreignKey: 'donorId', as: 'donationsMade' });
User.hasMany(Donation, { foreignKey: 'recipientId', as: 'donationsReceived' });
Donation.belongsTo(User, { foreignKey: 'donorId', as: 'donor' });
Donation.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

User.hasOne(Wallet, { foreignKey: 'userId', as: 'wallet' });
Wallet.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Project.hasMany(Donation, { foreignKey: 'projectId', as: 'donations' });
Donation.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Campaign, { foreignKey: 'createdBy', as: 'campaigns' });
Campaign.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

Campaign.hasMany(Donation, { foreignKey: 'campaignId', as: 'donations' });
Donation.belongsTo(Campaign, { foreignKey: 'campaignId', as: 'campaign' });

User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Post.hasMany(Donation, { foreignKey: 'postId', as: 'donations' });
Donation.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activityLogs' });
ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Student,
  Project,
  Post,
  Donation,
  Campaign,
  Wallet,
  ActivityLog,
};
