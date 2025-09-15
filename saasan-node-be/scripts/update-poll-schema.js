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

async function updatePollSchema() {
  try {
    console.log('🔄 Updating poll schema...');

    // Check if columns exist and add them if they don't
    const columns = [
      { name: 'type', type: 'string', defaultValue: 'single_choice' },
      { name: 'status', type: 'string', defaultValue: 'draft' },
      { name: 'category', type: 'string', defaultValue: null },
      { name: 'total_votes', type: 'integer', defaultValue: 0 },
      { name: 'start_date', type: 'timestamp', defaultValue: 'now()' },
      { name: 'end_date', type: 'timestamp', defaultValue: null },
      { name: 'created_by', type: 'uuid', defaultValue: null },
      { name: 'is_anonymous', type: 'boolean', defaultValue: false },
      { name: 'requires_verification', type: 'boolean', defaultValue: false },
      { name: 'district', type: 'string', defaultValue: null },
      { name: 'municipality', type: 'string', defaultValue: null },
      { name: 'ward', type: 'string', defaultValue: null },
      { name: 'politician_id', type: 'uuid', defaultValue: null },
      { name: 'party_id', type: 'uuid', defaultValue: null }
    ];

    for (const column of columns) {
      const columnExists = await db.schema.hasColumn('polls', column.name);
      if (!columnExists) {
        console.log(`Adding column: ${column.name}`);
        await db.schema.alterTable('polls', (table) => {
          if (column.type === 'string') {
            table.string(column.name).defaultTo(column.defaultValue);
          } else if (column.type === 'integer') {
            table.integer(column.name).defaultTo(column.defaultValue);
          } else if (column.type === 'boolean') {
            table.boolean(column.name).defaultTo(column.defaultValue);
          } else if (column.type === 'timestamp') {
            table.timestamp(column.name).defaultTo(column.defaultValue === 'now()' ? db.fn.now() : column.defaultValue);
          } else if (column.type === 'uuid') {
            table.uuid(column.name).defaultTo(column.defaultValue);
          }
        });
      } else {
        console.log(`Column ${column.name} already exists`);
      }
    }

    // Update existing polls with default values
    console.log('Updating existing polls with default values...');
    await db('polls').update({
      type: 'single_choice',
      status: 'active',
      category: 'General',
      total_votes: 0,
      start_date: db.fn.now(),
      is_anonymous: false,
      requires_verification: false
    });

    console.log('\n🎉 Poll schema updated successfully!');

  } catch (error) {
    console.error('❌ Error updating poll schema:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

// Run the script
updatePollSchema()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
