#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection string
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://fundhub_user:fundhub123@localhost:5432/fundhubdev';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runMigration() {
  const client = new Client({
    connectionString: DATABASE_URL
  });

  try {
    log('🚀 Starting database migration...', 'cyan');
    log(`📡 Connecting to database...`, 'blue');
    
    await client.connect();
    log('✅ Connected to database successfully!', 'green');

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${migrationPath}`);
    }

    log('📄 Reading migration file...', 'blue');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    log('🔄 Executing migration...', 'yellow');
    await client.query(migrationSQL);
    
    log('✅ Migration completed successfully!', 'green');
    
    // Verify tables were created
    log('🔍 Verifying tables...', 'blue');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    log('📋 Created tables:', 'cyan');
    result.rows.forEach(row => {
      log(`  - ${row.table_name}`, 'green');
    });

    // Check if admin user was created
    const adminCheck = await client.query(`
      SELECT username, email, role 
      FROM users 
      WHERE role = 'ADMIN';
    `);
    
    if (adminCheck.rows.length > 0) {
      log('👤 Admin user created:', 'cyan');
      adminCheck.rows.forEach(user => {
        log(`  - Username: ${user.username}, Email: ${user.email}`, 'green');
      });
      log('🔑 Default admin credentials: admin / admin123', 'yellow');
    }

  } catch (error) {
    log(`❌ Migration failed: ${error.message}`, 'red');
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await client.end();
    log('🔌 Database connection closed', 'blue');
  }
}

// Run the migration
runMigration().catch(error => {
  log(`💥 Fatal error: ${error.message}`, 'red');
  process.exit(1);
});