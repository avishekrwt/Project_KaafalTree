const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'rooms',
      key: 'id',
    },
  },
  guest_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  guest_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  guest_phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  checkin_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  checkout_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  num_guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  special_requests: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'paid', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending',
  },
  payment_id: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Booking;
