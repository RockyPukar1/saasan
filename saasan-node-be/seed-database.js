const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'saasan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');

    // Seed essential data only
    await seedUsers(client);
    await seedCategories(client);
    await seedPoliticalParties(client);
    await seedMajorCases(client);
    await seedViralData(client);

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

async function seedUsers(client) {
  console.log('👥 Seeding users...');
  
  const users = [
    {
      username: 'admin',
      email: 'admin@saasan.com',
      password_hash: '$2b$10$rQZ8K9vL8mN7pQ5rS6tT.uV1wX2yZ3aB4cD5eF6gH7iJ8kL9mN0oP',
      full_name: 'System Administrator',
      phone: '+977-1-2345678',
      district: 'Kathmandu',
      municipality: 'Kathmandu Metropolitan City',
      ward_number: 1,
      role: 'admin'
    },
    {
      username: 'reporter1',
      email: 'reporter1@saasan.com',
      password_hash: '$2b$10$rQZ8K9vL8mN7pQ5rS6tT.uV1wX2yZ3aB4cD5eF6gH7iJ8kL9mN0oP',
      full_name: 'John Doe',
      phone: '+977-1-2345679',
      district: 'Lalitpur',
      municipality: 'Lalitpur Metropolitan City',
      ward_number: 2,
      role: 'reporter'
    },
    {
      username: 'citizen1',
      email: 'citizen1@saasan.com',
      password_hash: '$2b$10$rQZ8K9vL8mN7pQ5rS6tT.uV1wX2yZ3aB4cD5eF6gH7iJ8kL9mN0oP',
      full_name: 'Jane Smith',
      phone: '+977-1-2345680',
      district: 'Bhaktapur',
      municipality: 'Bhaktapur Municipality',
      ward_number: 3,
      role: 'citizen'
    }
  ];

  for (const user of users) {
    await client.query(`
      INSERT INTO users (username, email, password_hash, full_name, phone, district, municipality, ward_number, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (email) DO NOTHING
    `, [user.username, user.email, user.password_hash, user.full_name, user.phone, user.district, user.municipality, user.ward_number, user.role]);
  }

  console.log('✅ Users seeded successfully');
}

async function seedCategories(client) {
  console.log('📂 Seeding categories...');
  
  const categories = [
    { name: 'Government Corruption', name_nepali: 'सरकारी भ्रष्टाचार', description: 'Corruption in government institutions' },
    { name: 'Public Works', name_nepali: 'सार्वजनिक कार्य', description: 'Corruption in public infrastructure projects' },
    { name: 'Education', name_nepali: 'शिक्षा', description: 'Corruption in education sector' },
    { name: 'Healthcare', name_nepali: 'स्वास्थ्य', description: 'Corruption in healthcare sector' },
    { name: 'Police', name_nepali: 'प्रहरी', description: 'Corruption in law enforcement' },
    { name: 'Judiciary', name_nepali: 'न्यायपालिका', description: 'Corruption in judicial system' }
  ];

  for (const category of categories) {
    await client.query(`
      INSERT INTO categories (name, name_nepali, description)
      VALUES ($1, $2, $3)
      ON CONFLICT DO NOTHING
    `, [category.name, category.name_nepali, category.description]);
  }

  console.log('✅ Categories seeded successfully');
}

async function seedPoliticalParties(client) {
  console.log('🏛️ Seeding political parties...');
  
  const parties = [
    { name: 'Nepali Congress', name_nepali: 'नेपाली कांग्रेस', abbreviation: 'NC', color: '#00FF00', founded_year: 1950, ideology: 'Social Democracy' },
    { name: 'CPN-UML', name_nepali: 'नेकपा एमाले', abbreviation: 'UML', color: '#FF0000', founded_year: 1991, ideology: 'Communism' },
    { name: 'Maoist Center', name_nepali: 'माओवादी केन्द्र', abbreviation: 'MC', color: '#0000FF', founded_year: 1994, ideology: 'Maoism' },
    { name: 'Rastriya Prajatantra Party', name_nepali: 'राष्ट्रिय प्रजातन्त्र पार्टी', abbreviation: 'RPP', color: '#FFFF00', founded_year: 1990, ideology: 'Monarchism' }
  ];

  for (const party of parties) {
    await client.query(`
      INSERT INTO political_parties (name, name_nepali, abbreviation, color, founded_year, ideology)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT DO NOTHING
    `, [party.name, party.name_nepali, party.abbreviation, party.color, party.founded_year, party.ideology]);
  }

  console.log('✅ Political parties seeded successfully');
}

async function seedMajorCases(client) {
  console.log('⚖️ Seeding major cases...');
  
  const majorCases = [
    {
      reference_number: 'MC-2024-001',
      title: 'Corruption in Road Construction Project',
      description: 'Massive corruption discovered in the construction of the Kathmandu-Pokhara highway. Contractors used substandard materials and inflated costs by 300%.',
      status: 'ongoing',
      priority: 'urgent',
      amount_involved: 1400000000,
      upvotes_count: 1250,
      views_count: 15420,
      shares_count: 890,
      district: 'Kathmandu',
      municipality: 'Kathmandu Metropolitan City',
      date_occurred: '2024-01-15',
      people_affected_count: 500000
    },
    {
      reference_number: 'MC-2024-002',
      title: 'Education Ministry Textbook Scam',
      description: 'Corruption in textbook procurement for public schools. Officials awarded contracts to companies with political connections.',
      status: 'solved',
      priority: 'high',
      amount_involved: 500000000,
      upvotes_count: 2100,
      views_count: 22300,
      shares_count: 1200,
      district: 'Bagmati',
      municipality: 'Lalitpur Metropolitan City',
      date_occurred: '2023-11-20',
      people_affected_count: 2000000
    },
    {
      reference_number: 'MC-2024-003',
      title: 'Healthcare Equipment Procurement Fraud',
      description: 'Corruption in procurement of medical equipment for government hospitals. Equipment was purchased at inflated prices and many items were never delivered.',
      status: 'unsolved',
      priority: 'urgent',
      amount_involved: 800000000,
      upvotes_count: 890,
      views_count: 12300,
      shares_count: 450,
      district: 'Gandaki',
      municipality: 'Pokhara Metropolitan City',
      date_occurred: '2024-02-10',
      people_affected_count: 1500000
    }
  ];

  for (const case_ of majorCases) {
    await client.query(`
      INSERT INTO major_cases (reference_number, title, description, status, priority, amount_involved, upvotes_count, views_count, shares_count, district, municipality, date_occurred, people_affected_count)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (reference_number) DO NOTHING
    `, [case_.reference_number, case_.title, case_.description, case_.status, case_.priority, case_.amount_involved, case_.upvotes_count, case_.views_count, case_.shares_count, case_.district, case_.municipality, case_.date_occurred, case_.people_affected_count]);
  }

  console.log('✅ Major cases seeded successfully');
}

async function seedViralData(client) {
  console.log('📱 Seeding viral data...');
  
  // Seed some viral shares
  const shares = [
    { item_id: '1', item_type: 'corruption_report', user_id: 1, platform: 'facebook' },
    { item_id: '1', item_type: 'corruption_report', user_id: 2, platform: 'twitter' },
    { item_id: '2', item_type: 'corruption_report', user_id: 1, platform: 'facebook' },
    { item_id: 'MC-2024-001', item_type: 'major_case', user_id: 1, platform: 'facebook' },
    { item_id: 'MC-2024-002', item_type: 'major_case', user_id: 2, platform: 'twitter' }
  ];

  for (const share of shares) {
    await client.query(`
      INSERT INTO viral_shares (item_id, item_type, user_id, platform)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
    `, [share.item_id, share.item_type, share.user_id, share.platform]);
  }

  // Seed some comments
  const comments = [
    { item_id: '1', item_type: 'corruption_report', user_id: 1, content: 'This is a serious issue that needs immediate attention.' },
    { item_id: '1', item_type: 'corruption_report', user_id: 2, content: 'I have witnessed similar corruption in my area too.' },
    { item_id: 'MC-2024-001', item_type: 'major_case', user_id: 1, content: 'This case should be investigated thoroughly.' },
    { item_id: 'MC-2024-002', item_type: 'major_case', user_id: 2, content: 'Finally some justice in this case!' }
  ];

  for (const comment of comments) {
    await client.query(`
      INSERT INTO comments (item_id, item_type, user_id, content)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
    `, [comment.item_id, comment.item_type, comment.user_id, comment.content]);
  }

  console.log('✅ Viral data seeded successfully');
}

// Run the seeding
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Database seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };