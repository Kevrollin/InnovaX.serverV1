const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/fundhub',
});

async function checkTables() {
  const client = await pool.connect();
  
  try {
    console.log('📋 Checking existing tables...\n');
    
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log(`Found ${tables.rows.length} tables:\n`);
    tables.rows.forEach(row => {
      console.log(`  ✓ ${row.table_name}`);
    });
    
    // Check if users table exists specifically
    const usersTable = tables.rows.find(row => row.table_name === 'users');
    if (usersTable) {
      console.log('\n✅ users table exists - ready for posts table creation');
    } else {
      console.log('\n❌ users table does not exist - cannot create posts table');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkTables();
