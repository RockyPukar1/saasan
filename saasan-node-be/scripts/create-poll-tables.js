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

async function createPollTables() {
  try {
    console.log('🗳️ Creating poll tables...');

    // Create polls table
    const pollsTableExists = await db.schema.hasTable('polls');
    if (!pollsTableExists) {
      await db.schema.createTable('polls', (table) => {
        table.uuid('id').primary();
        table.string('title').notNullable();
        table.text('description');
        table.string('type').defaultTo('single_choice');
        table.string('status').defaultTo('draft');
        table.string('category');
        table.integer('total_votes').defaultTo(0);
        table.timestamp('start_date').defaultTo(db.fn.now());
        table.timestamp('end_date');
        table.uuid('created_by');
        table.boolean('is_anonymous').defaultTo(false);
        table.boolean('requires_verification').defaultTo(false);
        table.string('district');
        table.string('municipality');
        table.string('ward');
        table.uuid('politician_id');
        table.uuid('party_id');
        table.timestamps(true, true);
      });
      console.log('✅ Created polls table');
    } else {
      console.log('ℹ️  polls table already exists');
    }

    // Create poll_options table
    const pollOptionsTableExists = await db.schema.hasTable('poll_options');
    if (!pollOptionsTableExists) {
      await db.schema.createTable('poll_options', (table) => {
        table.uuid('id').primary();
        table.uuid('poll_id').references('id').inTable('polls').onDelete('CASCADE');
        table.string('option').notNullable();
        table.integer('votes').defaultTo(0);
        table.timestamps(true, true);
      });
      console.log('✅ Created poll_options table');
    } else {
      console.log('ℹ️  poll_options table already exists');
    }

    // Create poll_votes table
    const pollVotesTableExists = await db.schema.hasTable('poll_votes');
    if (!pollVotesTableExists) {
      await db.schema.createTable('poll_votes', (table) => {
        table.uuid('id').primary();
        table.uuid('poll_id').references('id').inTable('polls').onDelete('CASCADE');
        table.uuid('user_id').references('id').inTable('users').onDelete('CASCADE');
        table.uuid('option_id').references('id').inTable('poll_options').onDelete('CASCADE');
        table.timestamps(true, true);
        
        // Ensure one vote per user per poll
        table.unique(['poll_id', 'user_id']);
      });
      console.log('✅ Created poll_votes table');
    } else {
      console.log('ℹ️  poll_votes table already exists');
    }

    console.log('\n🎉 Poll tables created successfully!');
    console.log('\n📋 Tables created:');
    console.log('- polls: Main poll information');
    console.log('- poll_options: Poll voting options');
    console.log('- poll_votes: User votes on polls');

  } catch (error) {
    console.error('❌ Error creating poll tables:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

// Run the script
createPollTables()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
