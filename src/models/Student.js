const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
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
  schoolEmail: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    field: 'school_email',
  },
  schoolName: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'school_name',
  },
  admissionNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'admission_number',
  },
  idNumber: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'id_number',
  },
  estimatedGraduationYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'estimated_graduation_year',
  },
  verificationStatus: {
    type: DataTypes.STRING(20),
    defaultValue: 'pending',
    allowNull: false,
    field: 'verification_status',
  },
  verificationMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'verification_message',
  },
  verifiedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'verified_by',
  },
  verifiedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'verified_at',
  },
}, {
  tableName: 'students',
  timestamps: true,
  underscored: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['school_email'] },
  ],
});

module.exports = Student;
