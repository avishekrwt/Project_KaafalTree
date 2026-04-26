const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GalleryImage = sequelize.define('GalleryImage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  image_url: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  alt_text: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  category: {
    type: DataTypes.ENUM('Property', 'Rooms', 'Restaurant', 'Surroundings'),
    allowNull: false,
    defaultValue: 'Property',
  },
  display_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'gallery_images',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = GalleryImage;
