const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/fundhub',
});

async function checkUsersTable() {
  const client = await pool.connect();
  
  try {
    console.log('📋 Checking users table structure...\n');
    
    const columns = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);
    
    console.log('Users table columns:');
    console.log('\nColumn Name | Type | Nullable | Default');
    console.log('-'.repeat(70));
    columns.rows.forEach(row => {
      console.log(`${row.column_name} | ${row.data_type} | ${row.is_nullable} | ${row.column_default || 'NULL'}`);
    });
    
    // Check primary key
    const pk = await client.query(`
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
      WHERE tc.table_name = 'users'
        AND tc.constraint_type = 'PRIMARY KEY';
    `);
    
    console.log('\n✅ Primary Key:', pk.rows.map(r => r.column_name).join(', '));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

checkUsersTable();
