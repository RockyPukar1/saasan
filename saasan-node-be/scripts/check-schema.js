const knex = require('knex');

// Database configuration
const config = {
  client: "postgresql",
  connection: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DBPORT || "5432"),
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_NAME || "saasan",
  },
};

const db = knex(config);

async function checkSchema() {
  try {
    console.log('🔍 Checking database schema...');
    
    // Get all tables
    const tables = await db.raw(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\n📋 Existing tables:');
    tables.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    // Check if specific tables exist
    const tableNames = tables.rows.map(row => row.table_name);
    
    console.log('\n🔍 Checking specific tables:');
    const requiredTables = [
      'users', 'districts', 'municipalities', 'wards', 
      'politicians', 'corruption_reports', 'historical_events', 
      'major_cases', 'polls', 'poll_options', 'poll_votes'
    ];
    
    for (const table of requiredTables) {
      const exists = tableNames.includes(table);
      console.log(`${exists ? '✅' : '❌'} ${table}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  } finally {
    await db.destroy();
  }
}

checkSchema();
