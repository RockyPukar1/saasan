const bcrypt = require('bcryptjs');
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

// Helper function to generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function seedSmart() {
  try {
    console.log('🌱 Starting smart data seeding...');
    
    // Clear only user-generated data
    console.log('🧹 Clearing user-generated data...');
    const userTables = ['poll_options', 'polls', 'corruption_reports', 'politicians', 'users'];
    
    for (const table of userTables) {
      try {
        await db(table).del();
        console.log(`✅ Cleared ${table}`);
      } catch (error) {
        console.log(`⚠️  Could not clear ${table}: ${error.message}`);
      }
    }
    
    // Check and seed levels if needed
    console.log('🏛️ Checking levels...');
    const existingLevels = await db('levels').count('* as count').first();
    if (existingLevels.count == 0) {
      const levels = [
        { id: 1, name: 'Federal', description: 'National level government' },
        { id: 2, name: 'Provincial', description: 'Provincial level government' },
        { id: 3, name: 'Local', description: 'Local level government' }
      ];
      
      for (const level of levels) {
        await db('levels').insert({
          id: level.id,
          name: level.name,
          description: level.description,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
      console.log('✅ Seeded levels');
    } else {
      console.log('✅ Levels already exist');
    }
    
    // Check and seed political parties if needed
    console.log('🏛️ Checking political parties...');
    const existingParties = await db('political_parties').count('* as count').first();
    if (existingParties.count == 0) {
      const politicalParties = [
        { id: 1, name: 'Nepali Congress', abbreviation: 'NC', color: '#FF0000', logo_url: 'https://via.placeholder.com/100x100?text=NC' },
        { id: 2, name: 'CPN-UML', abbreviation: 'UML', color: '#FF6600', logo_url: 'https://via.placeholder.com/100x100?text=UML' },
        { id: 3, name: 'CPN-Maoist Centre', abbreviation: 'MC', color: '#FF0000', logo_url: 'https://via.placeholder.com/100x100?text=MC' },
        { id: 4, name: 'Rastriya Prajatantra Party', abbreviation: 'RPP', color: '#0000FF', logo_url: 'https://via.placeholder.com/100x100?text=RPP' },
        { id: 5, name: 'Janata Samajbadi Party', abbreviation: 'JSP', color: '#00FF00', logo_url: 'https://via.placeholder.com/100x100?text=JSP' }
      ];
      
      for (const party of politicalParties) {
        await db('political_parties').insert({
          id: party.id,
          name: party.name,
          abbreviation: party.abbreviation,
          color: party.color,
          logo_url: party.logo_url,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
      console.log('✅ Seeded political parties');
    } else {
      console.log('✅ Political parties already exist');
    }
    
    // Check and seed positions if needed
    console.log('👔 Checking positions...');
    const existingPositions = await db('positions').count('* as count').first();
    if (existingPositions.count == 0) {
      const positions = [
        { id: 1, title: 'Prime Minister', level_id: 1, description: 'Head of Government' },
        { id: 2, title: 'Minister', level_id: 1, description: 'Cabinet Minister' },
        { id: 3, title: 'Member of Parliament', level_id: 1, description: 'Federal Parliament Member' },
        { id: 4, title: 'Chief Minister', level_id: 2, description: 'Head of Provincial Government' },
        { id: 5, title: 'Provincial Minister', level_id: 2, description: 'Provincial Cabinet Minister' },
        { id: 6, title: 'Mayor', level_id: 3, description: 'Head of Municipality' },
        { id: 7, title: 'Deputy Mayor', level_id: 3, description: 'Deputy Head of Municipality' },
        { id: 8, title: 'Ward Chairperson', level_id: 3, description: 'Head of Ward' }
      ];
      
      for (const position of positions) {
        await db('positions').insert({
          id: position.id,
          title: position.title,
          level_id: position.level_id,
          description: position.description,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
      console.log('✅ Seeded positions');
    } else {
      console.log('✅ Positions already exist');
    }
    
    // Check and seed constituencies if needed
    console.log('🗳️ Checking constituencies...');
    const existingConstituencies = await db('constituencies').count('* as count').first();
    if (existingConstituencies.count == 0) {
      const constituencies = [
        { id: 1, name: 'Kathmandu-1', level_id: 1, district: 'Kathmandu', municipality: 'Kathmandu Metropolitan City', ward_number: 1 },
        { id: 2, name: 'Kathmandu-2', level_id: 1, district: 'Kathmandu', municipality: 'Kathmandu Metropolitan City', ward_number: 2 },
        { id: 3, name: 'Kathmandu-3', level_id: 1, district: 'Kathmandu', municipality: 'Kathmandu Metropolitan City', ward_number: 3 },
        { id: 4, name: 'Lalitpur-1', level_id: 1, district: 'Lalitpur', municipality: 'Lalitpur Metropolitan City', ward_number: 1 },
        { id: 5, name: 'Lalitpur-2', level_id: 1, district: 'Lalitpur', municipality: 'Lalitpur Metropolitan City', ward_number: 2 },
        { id: 6, name: 'Pokhara-1', level_id: 1, district: 'Pokhara', municipality: 'Pokhara Metropolitan City', ward_number: 1 },
        { id: 7, name: 'Pokhara-2', level_id: 1, district: 'Pokhara', municipality: 'Pokhara Metropolitan City', ward_number: 2 },
        { id: 8, name: 'Chitwan-1', level_id: 1, district: 'Chitwan', municipality: 'Bharatpur Metropolitan City', ward_number: 1 }
      ];
      
      for (const constituency of constituencies) {
        await db('constituencies').insert({
          id: constituency.id,
          name: constituency.name,
          level_id: constituency.level_id,
          district: constituency.district,
          municipality: constituency.municipality,
          ward_number: constituency.ward_number,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
      console.log('✅ Seeded constituencies');
    } else {
      console.log('✅ Constituencies already exist');
    }
    
    // Check and seed corruption categories if needed
    console.log('📋 Checking corruption categories...');
    const existingCategories = await db('corruption_categories').count('* as count').first();
    if (existingCategories.count == 0) {
      const corruptionCategories = [
        { id: 1, name: 'Budget Misuse', description: 'Misuse of government budget', color: '#FF0000', icon: 'money' },
        { id: 2, name: 'Bribery', description: 'Accepting or giving bribes', color: '#FF6600', icon: 'handshake' },
        { id: 3, name: 'Land Grabbing', description: 'Illegal land acquisition', color: '#00FF00', icon: 'landmark' },
        { id: 4, name: 'Procurement Fraud', description: 'Fraud in government procurement', color: '#0000FF', icon: 'shopping-cart' },
        { id: 5, name: 'Nepotism', description: 'Favoritism in appointments', color: '#FF00FF', icon: 'users' },
        { id: 6, name: 'Embezzlement', description: 'Misappropriation of funds', color: '#FFFF00', icon: 'dollar-sign' },
        { id: 7, name: 'Document Fraud', description: 'Forgery of official documents', color: '#00FFFF', icon: 'file-text' },
        { id: 8, name: 'Contract Manipulation', description: 'Manipulation of contracts', color: '#800080', icon: 'edit' }
      ];
      
      for (const category of corruptionCategories) {
        await db('corruption_categories').insert({
          id: category.id,
          name: category.name,
          description: category.description,
          color: category.color,
          icon: category.icon,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
      console.log('✅ Seeded corruption categories');
    } else {
      console.log('✅ Corruption categories already exist');
    }
    
    // Seed users (always clear and recreate)
    console.log('👥 Seeding users...');
    const users = [
      {
        email: 'admin@saasan.com',
        password: 'admin123',
        full_name: 'System Administrator',
        phone: '+977-1-1234567',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward_number: 1,
        role: 'admin'
      },
      {
        email: 'officer1@saasan.com',
        password: 'officer123',
        full_name: 'Rajesh Kumar',
        phone: '+977-1-2345678',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward_number: 2,
        role: 'investigator'
      },
      {
        email: 'officer2@saasan.com',
        password: 'officer123',
        full_name: 'Sita Sharma',
        phone: '+977-1-3456789',
        district: 'Lalitpur',
        municipality: 'Lalitpur Metropolitan City',
        ward_number: 1,
        role: 'moderator'
      },
      {
        email: 'citizen1@saasan.com',
        password: 'citizen123',
        full_name: 'Ram Bahadur',
        phone: '+977-1-4567890',
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward_number: 3,
        role: 'citizen'
      },
      {
        email: 'citizen2@saasan.com',
        password: 'citizen123',
        full_name: 'Gita Devi',
        phone: '+977-1-5678901',
        district: 'Pokhara',
        municipality: 'Pokhara Metropolitan City',
        ward_number: 1,
        role: 'citizen'
      }
    ];
    
    const createdUsers = [];
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const [createdUser] = await db('users').insert({
        id: generateUUID(),
        email: user.email,
        password_hash: hashedPassword,
        full_name: user.full_name,
        phone: user.phone,
        district: user.district,
        municipality: user.municipality,
        ward_number: user.ward_number,
        role: user.role,
        created_at: new Date(),
        updated_at: new Date(),
        last_active_at: new Date()
      }).returning('*');
      createdUsers.push(createdUser);
    }
    console.log('✅ Seeded users');
    
    // Seed politicians
    console.log('👨‍💼 Seeding politicians...');
    const politicians = [
      {
        full_name: 'Sher Bahadur Deuba',
        position_id: 1,
        party_id: 1,
        constituency_id: 1,
        biography: 'Former Prime Minister of Nepal with extensive political experience.',
        education: 'Master in Political Science',
        experience_years: 35,
        date_of_birth: '1946-06-13',
        profile_image_url: 'https://via.placeholder.com/300x300?text=Sher+Deuba',
        contact_phone: '+977-1-1111111',
        contact_email: 'sher.deuba@nepal.gov.np',
        official_website: 'https://sherdeuba.np',
        social_media_links: JSON.stringify({ twitter: '@sherdeuba', facebook: 'sherdeuba.official' }),
        status: 'active',
        term_start_date: '2021-07-13',
        term_end_date: '2026-07-13',
        total_votes_received: 125000,
        is_active: true
      },
      {
        full_name: 'K P Sharma Oli',
        position_id: 2,
        party_id: 2,
        constituency_id: 2,
        biography: 'Former Prime Minister and Chairman of CPN-UML.',
        education: 'Bachelor in Arts',
        experience_years: 40,
        date_of_birth: '1952-02-22',
        profile_image_url: 'https://via.placeholder.com/300x300?text=KP+Oli',
        contact_phone: '+977-1-2222222',
        contact_email: 'kp.oli@nepal.gov.np',
        official_website: 'https://kpsharmaoli.np',
        social_media_links: JSON.stringify({ twitter: '@kpsharmaoli', facebook: 'kpsharmaoli.official' }),
        status: 'active',
        term_start_date: '2021-07-13',
        term_end_date: '2026-07-13',
        total_votes_received: 118000,
        is_active: true
      },
      {
        full_name: 'Pushpa Kamal Dahal',
        position_id: 3,
        party_id: 3,
        constituency_id: 3,
        biography: 'Former Prime Minister and Chairman of CPN-Maoist Centre.',
        education: 'Master in Political Science',
        experience_years: 30,
        date_of_birth: '1954-12-11',
        profile_image_url: 'https://via.placeholder.com/300x300?text=Prachanda',
        contact_phone: '+977-1-3333333',
        contact_email: 'prachanda@nepal.gov.np',
        official_website: 'https://prachanda.np',
        social_media_links: JSON.stringify({ twitter: '@prachanda', facebook: 'prachanda.official' }),
        status: 'active',
        term_start_date: '2021-07-13',
        term_end_date: '2026-07-13',
        total_votes_received: 112000,
        is_active: true
      }
    ];
    
    for (const politician of politicians) {
      await db('politicians').insert({
        id: generateUUID(),
        full_name: politician.full_name,
        position_id: politician.position_id,
        party_id: politician.party_id,
        constituency_id: politician.constituency_id,
        biography: politician.biography,
        education: politician.education,
        experience_years: politician.experience_years,
        date_of_birth: politician.date_of_birth,
        profile_image_url: politician.profile_image_url,
        contact_phone: politician.contact_phone,
        contact_email: politician.contact_email,
        official_website: politician.official_website,
        social_media_links: politician.social_media_links,
        status: politician.status,
        term_start_date: politician.term_start_date,
        term_end_date: politician.term_end_date,
        total_votes_received: politician.total_votes_received,
        is_active: politician.is_active,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    console.log('✅ Seeded politicians');
    
    // Seed corruption reports
    console.log('📋 Seeding corruption reports...');
    const investigatorUser = createdUsers.find(u => u.role === 'investigator');
    const citizenUser = createdUsers.find(u => u.role === 'citizen');
    
    const corruptionReports = [
      {
        title: 'Misuse of Development Budget',
        description: 'Alleged misuse of development budget allocated for road construction in Kathmandu Valley.',
        category_id: 1,
        reporter_id: citizenUser?.id,
        is_anonymous: false,
        location_description: 'Kathmandu Valley Road Construction Project',
        latitude: 27.7172,
        longitude: 85.3240,
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward: '1',
        status: 'submitted',
        priority: 'high',
        assigned_to_officer_id: investigatorUser?.id,
        date_occurred: '2024-01-15',
        amount_involved: 50000000,
        people_affected_count: 1000,
        public_visibility: 'public',
        upvotes_count: 25,
        downvotes_count: 3,
        views_count: 150,
        shares_count: 8,
        is_public: true
      },
      {
        title: 'Bribery in Government Contract',
        description: 'Report of bribery involved in awarding government contract for hospital construction.',
        category_id: 2,
        reporter_id: null,
        is_anonymous: true,
        location_description: 'Central Hospital Construction Site',
        latitude: 27.7172,
        longitude: 85.3240,
        district: 'Kathmandu',
        municipality: 'Kathmandu Metropolitan City',
        ward: '2',
        status: 'under_review',
        priority: 'urgent',
        assigned_to_officer_id: investigatorUser?.id,
        date_occurred: '2024-01-20',
        amount_involved: 100000000,
        people_affected_count: 5000,
        public_visibility: 'public',
        upvotes_count: 45,
        downvotes_count: 2,
        views_count: 300,
        shares_count: 15,
        is_public: true
      },
      {
        title: 'Land Grabbing by Officials',
        description: 'Illegal land grabbing by government officials in Lalitpur district.',
        category_id: 3,
        reporter_id: citizenUser?.id,
        is_anonymous: false,
        location_description: 'Lalitpur District Land Office',
        latitude: 27.6710,
        longitude: 85.3250,
        district: 'Lalitpur',
        municipality: 'Lalitpur Metropolitan City',
        ward: '1',
        status: 'verified',
        priority: 'medium',
        assigned_to_officer_id: investigatorUser?.id,
        date_occurred: '2024-01-10',
        amount_involved: 25000000,
        people_affected_count: 200,
        public_visibility: 'public',
        upvotes_count: 30,
        downvotes_count: 1,
        views_count: 200,
        shares_count: 12,
        is_public: true
      }
    ];
    
    for (const report of corruptionReports) {
      await db('corruption_reports').insert({
        id: generateUUID(),
        reference_number: `CR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        title: report.title,
        description: report.description,
        category_id: report.category_id,
        reporter_id: report.reporter_id,
        is_anonymous: report.is_anonymous,
        location_description: report.location_description,
        latitude: report.latitude,
        longitude: report.longitude,
        district: report.district,
        municipality: report.municipality,
        ward: report.ward,
        status: report.status,
        priority: report.priority,
        assigned_to_officer_id: report.assigned_to_officer_id,
        date_occurred: report.date_occurred,
        amount_involved: report.amount_involved,
        people_affected_count: report.people_affected_count,
        public_visibility: report.public_visibility,
        upvotes_count: report.upvotes_count,
        downvotes_count: report.downvotes_count,
        views_count: report.views_count,
        shares_count: report.shares_count,
        is_public: report.is_public,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    console.log('✅ Seeded corruption reports');
    
    // Seed polls
    console.log('🗳️ Seeding polls...');
    const polls = [
      {
        title: 'Do you think corruption has increased in Nepal?',
        description: 'A poll to gauge public opinion on corruption levels in Nepal.',
        options: [
          { option: 'Yes, significantly increased', votes: 0 },
          { option: 'Yes, slightly increased', votes: 0 },
          { option: 'No change', votes: 0 },
          { option: 'Decreased', votes: 0 }
        ]
      },
      {
        title: 'Which sector has the most corruption?',
        description: 'Public opinion on the most corrupt sectors in Nepal.',
        options: [
          { option: 'Government Administration', votes: 0 },
          { option: 'Police', votes: 0 },
          { option: 'Judiciary', votes: 0 },
          { option: 'Education', votes: 0 },
          { option: 'Health', votes: 0 }
        ]
      },
      {
        title: 'How effective is the current anti-corruption system?',
        description: 'Assessment of the effectiveness of current anti-corruption measures.',
        options: [
          { option: 'Very effective', votes: 0 },
          { option: 'Somewhat effective', votes: 0 },
          { option: 'Not very effective', votes: 0 },
          { option: 'Not effective at all', votes: 0 }
        ]
      }
    ];
    
    for (const poll of polls) {
      const [createdPoll] = await db('polls').insert({
        id: generateUUID(),
        title: poll.title,
        description: poll.description,
        created_at: new Date(),
        updated_at: new Date()
      }).returning('*');
      
      // Seed poll options
      for (const option of poll.options) {
        await db('poll_options').insert({
          id: generateUUID(),
          poll_id: createdPoll.id,
          option: option.option,
          votes: option.votes,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }
    console.log('✅ Seeded polls');
    
    console.log('\n🎉 Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- 3 levels (Federal, Provincial, Local)`);
    console.log(`- 5 political parties`);
    console.log(`- 8 positions`);
    console.log(`- 8 constituencies`);
    console.log(`- 8 corruption categories`);
    console.log(`- ${users.length} users`);
    console.log(`- ${politicians.length} politicians`);
    console.log(`- ${corruptionReports.length} corruption reports`);
    console.log(`- ${polls.length} polls`);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@saasan.com / admin123');
    console.log('Officer: officer1@saasan.com / officer123');
    console.log('Citizen: citizen1@saasan.com / citizen123');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await db.destroy();
  }
}

// Run the seeding
seedSmart();
