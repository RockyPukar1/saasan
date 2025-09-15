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

async function inspectSchema() {
  try {
    console.log('🔍 Inspecting database schema...');
    
    // Get column information for key tables
    const tables = ['users', 'levels', 'political_parties', 'positions', 'constituencies', 'corruption_categories', 'politicians', 'corruption_reports', 'polls', 'poll_options'];
    
    for (const table of tables) {
      try {
        const columns = await db.raw(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns 
          WHERE table_name = '${table}' 
          ORDER BY ordinal_position;
        `);
        
        console.log(`\n📋 Table: ${table}`);
        console.log('Columns:');
        columns.rows.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });
      } catch (error) {
        console.log(`❌ Could not inspect ${table}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error inspecting schema:', error);
  } finally {
    await db.destroy();
  }
}

inspectSchema();
