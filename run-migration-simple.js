const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/fundhub',
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Reading migration file...');
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, 'migrations', 'create_posts_table_simple.sql'),
      'utf8'
    );

    console.log('🚀 Running migration...\n');
    
    // Split by semicolons and execute each statement separately
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log(`✅ ${i + 1}/${statements.length}: Executed successfully`);
        } catch (error) {
          // Skip if table/column already exists
          if (error.message.includes('already exists') || 
              error.message.includes('duplicate')) {
            console.log(`⏭️  ${i + 1}/${statements.length}: Already exists (skipped)`);
          } else {
            console.error(`❌ ${i + 1}/${statements.length}: Error`);
            console.error('   Message:', error.message.split('\n')[0]);
            console.error('   Code:', error.code);
            // Continue with next statement
          }
        }
      }
    }

    console.log('\n✅ Migration process completed!');
    
    // Verify the tables exist
    console.log('\n📋 Verifying tables...');
    try {
      const tables = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('posts', 'donations')
        ORDER BY table_name;
      `);
      
      console.log('📊 Existing tables:');
      tables.rows.forEach(row => console.log(`  ✓ ${row.table_name}`));
    } catch (error) {
      console.error('⚠️  Could not verify tables:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
