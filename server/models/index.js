const sequelize = require('../config/db');
const Admin = require('./Admin');
const Room = require('./Room');
const Booking = require('./Booking');
const Contact = require('./Contact');
const MenuCategory = require('./MenuCategory');
const MenuItem = require('./MenuItem');
const GalleryImage = require('./GalleryImage');
const Testimonial = require('./Testimonial');

// Associations
Room.hasMany(Booking, { foreignKey: 'room_id', as: 'bookings' });
Booking.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });

MenuCategory.hasMany(MenuItem, { foreignKey: 'category_id', as: 'items', onDelete: 'CASCADE' });
MenuItem.belongsTo(MenuCategory, { foreignKey: 'category_id', as: 'category' });

module.exports = {
  sequelize,
  Admin,
  Room,
  Booking,
  Contact,
  MenuCategory,
  MenuItem,
  GalleryImage,
  Testimonial,
};
