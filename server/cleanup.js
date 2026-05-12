require('dotenv').config();
const sequelize = require('./config/db');

async function fix() {
  try {
    await sequelize.authenticate();
    await sequelize.query('CREATE TABLE IF NOT EXISTS SequelizeMeta (name VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL, PRIMARY KEY (name)) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;');
    await sequelize.query("INSERT IGNORE INTO SequelizeMeta (name) VALUES ('20260512112437-initial-schema.js');");
    await sequelize.query("INSERT IGNORE INTO SequelizeMeta (name) VALUES ('20260512120908-add-link-to-testimonials.js');");
    try {
      await sequelize.query('ALTER TABLE testimonials ADD COLUMN link VARCHAR(255);');
      console.log('Added link column');
    } catch(e) {
      console.log('Column already exists or error:', e.message);
    }
    console.log('Done!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
fix();
