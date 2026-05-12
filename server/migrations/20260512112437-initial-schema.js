'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('admins', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      username: { type: Sequelize.STRING(50), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false },
      password_hash: { type: Sequelize.CHAR(60), allowNull: false },
      role: { type: Sequelize.ENUM('admin', 'superadmin'), allowNull: false, defaultValue: 'admin' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.addIndex('admins', ['username'], { unique: true, name: 'idx_admins_username' });
    await queryInterface.addIndex('admins', ['email'], { unique: true, name: 'idx_admins_email' });

    await queryInterface.createTable('rooms', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      price_per_night: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
      total_units: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      capacity: { type: Sequelize.STRING(50), allowNull: false, defaultValue: '2 Guests' },
      amenities: { type: Sequelize.JSON, allowNull: true },
      image_url: { type: Sequelize.STRING(255), allowNull: true },
      is_available: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('bookings', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      room_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'rooms', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      guest_name: { type: Sequelize.STRING(100), allowNull: false },
      guest_email: { type: Sequelize.STRING(255), allowNull: false },
      guest_phone: { type: Sequelize.STRING(20), allowNull: false },
      checkin_date: { type: Sequelize.DATEONLY, allowNull: false },
      checkout_date: { type: Sequelize.DATEONLY, allowNull: false },
      num_guests: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
      total_price: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      special_requests: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.ENUM('pending', 'confirmed', 'paid', 'cancelled'), allowNull: false, defaultValue: 'pending' },
      payment_id: { type: Sequelize.STRING(100), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('contacts', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      email: { type: Sequelize.STRING(255), allowNull: false },
      phone: { type: Sequelize.STRING(20), allowNull: true },
      message: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.ENUM('new', 'responded'), allowNull: false, defaultValue: 'new' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('menu_categories', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('menu_items', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'menu_categories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: { type: Sequelize.STRING(100), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: true },
      is_vegetarian: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      is_available: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('gallery_images', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      image_url: { type: Sequelize.STRING(255), allowNull: false },
      alt_text: { type: Sequelize.STRING(255), allowNull: true },
      category: { type: Sequelize.ENUM('Property', 'Rooms', 'Restaurant', 'Surroundings'), allowNull: false, defaultValue: 'Property' },
      display_order: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });

    await queryInterface.createTable('testimonials', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      guest_name: { type: Sequelize.STRING(100), allowNull: false },
      review_text: { type: Sequelize.TEXT, allowNull: false },
      rating: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
      is_approved: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('testimonials');
    await queryInterface.dropTable('gallery_images');
    await queryInterface.dropTable('menu_items');
    await queryInterface.dropTable('menu_categories');
    await queryInterface.dropTable('contacts');
    await queryInterface.dropTable('bookings');
    await queryInterface.dropTable('rooms');
    await queryInterface.dropTable('admins');
  }
};
