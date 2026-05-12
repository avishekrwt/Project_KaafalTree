require('dotenv').config();
const sequelize = require('./config/db');

async function cleanup() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB for cleanup.');

    // Get all indexes from admins table
    const [indexes] = await sequelize.query('SHOW INDEX FROM admins;');
    
    // Group indexes by column name to find duplicates
    const indexGroups = {};
    for (const index of indexes) {
      if (index.Key_name === 'PRIMARY') continue;
      
      const col = index.Column_name;
      if (!indexGroups[col]) indexGroups[col] = [];
      indexGroups[col].push(index.Key_name);
    }

    // Keep one index per column, drop the rest
    for (const col in indexGroups) {
      const keys = indexGroups[col];
      if (keys.length > 1) {
        // Sort keys, keep the one named 'idx_admins_username' if it exists, or just the shortest/first one
        const keepKey = keys.find(k => k.startsWith('idx_admins_')) || keys[0];
        const keysToDrop = keys.filter(k => k !== keepKey);
        
        for (const keyToDrop of keysToDrop) {
          console.log(`Dropping duplicate index: ${keyToDrop} on column ${col}`);
          await sequelize.query(`ALTER TABLE admins DROP INDEX \`${keyToDrop}\`;`);
        }
      }
    }

    console.log('Cleanup completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Cleanup failed:', err);
    process.exit(1);
  }
}

cleanup();
