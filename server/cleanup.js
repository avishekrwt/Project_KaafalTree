require('dotenv').config();
const sequelize = require('./config/db');

async function fix() {
  try {
    await sequelize.authenticate();
    console.log('Connected.');

    // Add the link column to testimonials if it doesn't exist
    const [cols] = await sequelize.query(
      "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'testimonials' AND COLUMN_NAME = 'link';"
    );

    if (cols.length === 0) {
      await sequelize.query('ALTER TABLE testimonials ADD COLUMN link VARCHAR(255) NULL;');
      console.log('✅ Added link column to testimonials table.');
    } else {
      console.log('ℹ️  link column already exists, skipping.');
    }

    process.exit(0);
  } catch (err) {
    console.error('Failed:', err.message);
    process.exit(1);
  }
}

fix();
