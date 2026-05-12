const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  password_hash: {
    type: DataTypes.CHAR(60),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'superadmin'),
    allowNull: false,
    defaultValue: 'admin',
  },
}, {
  tableName: 'admins',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  defaultScope: {
    attributes: { exclude: ['password_hash'] },
  },
  scopes: {
    withPassword: {
      attributes: {},
    },
  },
  indexes: [
    {
      unique: true,
      name: 'idx_admins_username',
      fields: ['username'],
    },
    {
      unique: true,
      name: 'idx_admins_email',
      fields: ['email'],
    },
  ],
});

module.exports = Admin;
