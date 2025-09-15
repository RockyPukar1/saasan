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

// Sample data
const districts = [
  { name: 'Kathmandu', province: 'Bagmati' },
  { name: 'Lalitpur', province: 'Bagmati' },
  { name: 'Bhaktapur', province: 'Bagmati' },
  { name: 'Pokhara', province: 'Gandaki' },
  { name: 'Chitwan', province: 'Bagmati' },
  { name: 'Bharatpur', province: 'Bagmati' },
  { name: 'Biratnagar', province: 'Koshi' },
  { name: 'Birgunj', province: 'Madhesh' },
  { name: 'Dharan', province: 'Koshi' },
  { name: 'Butwal', province: 'Lumbini' }
];

const municipalities = [
  { name: 'Kathmandu Metropolitan City', district: 'Kathmandu' },
  { name: 'Lalitpur Metropolitan City', district: 'Lalitpur' },
  { name: 'Bhaktapur Municipality', district: 'Bhaktapur' },
  { name: 'Pokhara Metropolitan City', district: 'Pokhara' },
  { name: 'Bharatpur Metropolitan City', district: 'Chitwan' },
  { name: 'Biratnagar Metropolitan City', district: 'Biratnagar' },
  { name: 'Birgunj Metropolitan City', district: 'Birgunj' },
  { name: 'Dharan Sub-Metropolitan City', district: 'Dharan' },
  { name: 'Butwal Sub-Metropolitan City', district: 'Butwal' }
];

const wards = [
  { number: 1, municipality: 'Kathmandu Metropolitan City' },
  { number: 2, municipality: 'Kathmandu Metropolitan City' },
  { number: 3, municipality: 'Kathmandu Metropolitan City' },
  { number: 4, municipality: 'Kathmandu Metropolitan City' },
  { number: 5, municipality: 'Kathmandu Metropolitan City' },
  { number: 1, municipality: 'Lalitpur Metropolitan City' },
  { number: 2, municipality: 'Lalitpur Metropolitan City' },
  { number: 3, municipality: 'Lalitpur Metropolitan City' },
  { number: 1, municipality: 'Pokhara Metropolitan City' },
  { number: 2, municipality: 'Pokhara Metropolitan City' }
];

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

const politicians = [
  {
    fullName: 'Sher Bahadur Deuba',
    positionId: 1,
    partyId: 1,
    constituencyId: 1,
    biography: 'Former Prime Minister of Nepal with extensive political experience.',
    education: 'Master in Political Science',
    experienceYears: 35,
    dateOfBirth: '1946-06-13',
    profileImageUrl: 'https://via.placeholder.com/300x300?text=Sher+Deuba',
    contactPhone: '+977-1-1111111',
    contactEmail: 'sher.deuba@nepal.gov.np',
    officialWebsite: 'https://sherdeuba.np',
    socialMediaLinks: { twitter: '@sherdeuba', facebook: 'sherdeuba.official' },
    status: 'active',
    termStartDate: '2021-07-13',
    termEndDate: '2026-07-13',
    totalVotesReceived: 125000
  },
  {
    fullName: 'K P Sharma Oli',
    positionId: 2,
    partyId: 2,
    constituencyId: 2,
    biography: 'Former Prime Minister and Chairman of CPN-UML.',
    education: 'Bachelor in Arts',
    experienceYears: 40,
    dateOfBirth: '1952-02-22',
    profileImageUrl: 'https://via.placeholder.com/300x300?text=KP+Oli',
    contactPhone: '+977-1-2222222',
    contactEmail: 'kp.oli@nepal.gov.np',
    officialWebsite: 'https://kpsharmaoli.np',
    socialMediaLinks: { twitter: '@kpsharmaoli', facebook: 'kpsharmaoli.official' },
    status: 'active',
    termStartDate: '2021-07-13',
    termEndDate: '2026-07-13',
    totalVotesReceived: 118000
  },
  {
    fullName: 'Pushpa Kamal Dahal',
    positionId: 3,
    partyId: 3,
    constituencyId: 3,
    biography: 'Former Prime Minister and Chairman of CPN-Maoist Centre.',
    education: 'Master in Political Science',
    experienceYears: 30,
    dateOfBirth: '1954-12-11',
    profileImageUrl: 'https://via.placeholder.com/300x300?text=Prachanda',
    contactPhone: '+977-1-3333333',
    contactEmail: 'prachanda@nepal.gov.np',
    officialWebsite: 'https://prachanda.np',
    socialMediaLinks: { twitter: '@prachanda', facebook: 'prachanda.official' },
    status: 'active',
    termStartDate: '2021-07-13',
    termEndDate: '2026-07-13',
    totalVotesReceived: 112000
  }
];

const corruptionReports = [
  {
    title: 'Misuse of Development Budget',
    description: 'Alleged misuse of development budget allocated for road construction in Kathmandu Valley.',
    categoryId: 'budget-misuse',
    reporterId: null, // Will be set after user creation
    isAnonymous: true,
    locationDescription: 'Kathmandu Valley Road Construction Project',
    latitude: 27.7172,
    longitude: 85.3240,
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan City',
    ward: '1',
    status: 'submitted',
    priority: 'high',
    assignedToOfficerId: null, // Will be set after user creation
    dateOccurred: '2024-01-15',
    amountInvolved: 50000000,
    peopleAffectedCount: 1000,
    publicVisibility: 'public',
    upvotesCount: 25,
    downvotesCount: 3,
    viewsCount: 150,
    sharesCount: 8
  },
  {
    title: 'Bribery in Government Contract',
    description: 'Report of bribery involved in awarding government contract for hospital construction.',
    categoryId: 'bribery',
    reporterId: null,
    isAnonymous: false,
    locationDescription: 'Central Hospital Construction Site',
    latitude: 27.7172,
    longitude: 85.3240,
    district: 'Kathmandu',
    municipality: 'Kathmandu Metropolitan City',
    ward: '2',
    status: 'under_review',
    priority: 'urgent',
    assignedToOfficerId: null,
    dateOccurred: '2024-01-20',
    amountInvolved: 100000000,
    peopleAffectedCount: 5000,
    publicVisibility: 'public',
    upvotesCount: 45,
    downvotesCount: 2,
    viewsCount: 300,
    sharesCount: 15
  },
  {
    title: 'Land Grabbing by Officials',
    description: 'Illegal land grabbing by government officials in Lalitpur district.',
    categoryId: 'land-grabbing',
    reporterId: null,
    isAnonymous: true,
    locationDescription: 'Lalitpur District Land Office',
    latitude: 27.6710,
    longitude: 85.3250,
    district: 'Lalitpur',
    municipality: 'Lalitpur Metropolitan City',
    ward: '1',
    status: 'verified',
    priority: 'medium',
    assignedToOfficerId: null,
    dateOccurred: '2024-01-10',
    amountInvolved: 25000000,
    peopleAffectedCount: 200,
    publicVisibility: 'public',
    upvotesCount: 30,
    downvotesCount: 1,
    viewsCount: 200,
    sharesCount: 12
  }
];

const historicalEvents = [
  {
    title: 'Panchayat System Abolition',
    description: 'The end of the Panchayat system and establishment of multi-party democracy in Nepal.',
    category: 'Political Change',
    significance: 'high',
    year: 1990,
    location: 'Kathmandu',
    impact: 'Led to the establishment of constitutional monarchy and multi-party democracy.',
    relatedPoliticians: 'Girija Prasad Koirala, Krishna Prasad Bhattarai',
    sources: 'Constitution of Nepal 1990, Historical records'
  },
  {
    title: 'Maoist Insurgency',
    description: 'The decade-long Maoist insurgency that led to the end of monarchy.',
    category: 'Conflict',
    significance: 'very_high',
    year: 1996,
    location: 'Nepal',
    impact: 'Resulted in the abolition of monarchy and establishment of federal republic.',
    relatedPoliticians: 'Pushpa Kamal Dahal, Baburam Bhattarai',
    sources: 'Comprehensive Peace Accord 2006'
  },
  {
    title: 'Royal Massacre',
    description: 'The assassination of King Birendra and his family members.',
    category: 'Tragedy',
    significance: 'very_high',
    year: 2001,
    location: 'Narayanhiti Palace, Kathmandu',
    impact: 'Led to political instability and eventual abolition of monarchy.',
    relatedPoliticians: 'Gyanendra Shah',
    sources: 'Official investigation reports'
  }
];

const majorCases = [
  {
    title: 'Wide Body Aircraft Purchase Scandal',
    description: 'Corruption case involving the purchase of wide-body aircraft for Nepal Airlines.',
    category: 'Procurement Fraud',
    status: 'ongoing',
    priority: 'high',
    amountInvolved: 4000000000,
    peopleAffected: 30000000,
    startDate: '2018-01-01',
    expectedResolutionDate: '2024-12-31',
    responsibleOfficials: 'Former Tourism Minister, Nepal Airlines officials',
    currentStatus: 'Under investigation by CIAA',
    progress: 60
  },
  {
    title: 'Melamchi Water Project Corruption',
    description: 'Corruption and mismanagement in the Melamchi Water Supply Project.',
    category: 'Infrastructure Fraud',
    status: 'ongoing',
    priority: 'urgent',
    amountInvolved: 5000000000,
    peopleAffected: 1500000,
    startDate: '2016-01-01',
    expectedResolutionDate: '2024-06-30',
    responsibleOfficials: 'Project officials, contractors',
    currentStatus: 'Under CIAA investigation',
    progress: 75
  },
  {
    title: 'Citizenship Distribution Scam',
    description: 'Illegal distribution of Nepali citizenship certificates.',
    category: 'Document Fraud',
    status: 'solved',
    priority: 'medium',
    amountInvolved: 50000000,
    peopleAffected: 10000,
    startDate: '2019-01-01',
    expectedResolutionDate: '2022-12-31',
    responsibleOfficials: 'District Administration Office officials',
    currentStatus: 'Resolved - Officials convicted',
    progress: 100
  }
];

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

async function seedAllData() {
  try {
    console.log('🌱 Starting comprehensive data seeding...');
    
    // Clear existing data (in reverse order of dependencies)
    console.log('🧹 Clearing existing data...');
    await db('poll_votes').del();
    await db('poll_options').del();
    await db('polls').del();
    await db('major_cases').del();
    await db('historical_events').del();
    await db('corruption_reports').del();
    await db('political_promises').del();
    await db('politicians').del();
    await db('wards').del();
    await db('municipalities').del();
    await db('districts').del();
    await db('users').del();
    
    // Seed districts
    console.log('🏛️ Seeding districts...');
    for (const district of districts) {
      await db('districts').insert({
        id: generateUUID(),
        name: district.name,
        province: district.province,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    // Seed municipalities
    console.log('🏘️ Seeding municipalities...');
    for (const municipality of municipalities) {
      const district = await db('districts').where('name', municipality.district).first();
      if (district) {
        await db('municipalities').insert({
          id: generateUUID(),
          name: municipality.name,
          district_id: district.id,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }
    
    // Seed wards
    console.log('🏠 Seeding wards...');
    for (const ward of wards) {
      const municipality = await db('municipalities').where('name', ward.municipality).first();
      if (municipality) {
        await db('wards').insert({
          id: generateUUID(),
          number: ward.number,
          municipality_id: municipality.id,
          created_at: new Date(),
          updated_at: new Date()
        });
      }
    }
    
    // Seed users
    console.log('👥 Seeding users...');
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
    
    // Seed politicians
    console.log('👨‍💼 Seeding politicians...');
    for (const politician of politicians) {
      await db('politicians').insert({
        id: generateUUID(),
        full_name: politician.fullName,
        position_id: politician.positionId,
        party_id: politician.partyId,
        constituency_id: politician.constituencyId,
        biography: politician.biography,
        education: politician.education,
        experience_years: politician.experienceYears,
        date_of_birth: politician.dateOfBirth,
        profile_image_url: politician.profileImageUrl,
        contact_phone: politician.contactPhone,
        contact_email: politician.contactEmail,
        official_website: politician.officialWebsite,
        social_media_links: JSON.stringify(politician.socialMediaLinks),
        status: politician.status,
        term_start_date: politician.termStartDate,
        term_end_date: politician.termEndDate,
        total_votes_received: politician.totalVotesReceived,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    // Seed corruption reports
    console.log('📋 Seeding corruption reports...');
    const adminUser = createdUsers.find(u => u.role === 'admin');
    const investigatorUser = createdUsers.find(u => u.role === 'investigator');
    
    for (const report of corruptionReports) {
      const reporterId = report.isAnonymous ? null : createdUsers.find(u => u.role === 'citizen')?.id;
      await db('corruption_reports').insert({
        id: generateUUID(),
        reference_number: `CR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        title: report.title,
        description: report.description,
        category_id: report.categoryId,
        reporter_id: reporterId,
        is_anonymous: report.isAnonymous,
        location_description: report.locationDescription,
        latitude: report.latitude,
        longitude: report.longitude,
        district: report.district,
        municipality: report.municipality,
        ward: report.ward,
        status: report.status,
        priority: report.priority,
        assigned_to_officer_id: investigatorUser?.id,
        date_occurred: report.dateOccurred,
        amount_involved: report.amountInvolved,
        people_affected_count: report.peopleAffectedCount,
        public_visibility: report.publicVisibility,
        upvotes_count: report.upvotesCount,
        downvotes_count: report.downvotesCount,
        views_count: report.viewsCount,
        shares_count: report.sharesCount,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    // Seed historical events
    console.log('📚 Seeding historical events...');
    for (const event of historicalEvents) {
      await db('historical_events').insert({
        id: generateUUID(),
        title: event.title,
        description: event.description,
        category: event.category,
        significance: event.significance,
        year: event.year,
        location: event.location,
        impact: event.impact,
        related_politicians: event.relatedPoliticians,
        sources: event.sources,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    // Seed major cases
    console.log('⚖️ Seeding major cases...');
    for (const case_ of majorCases) {
      await db('major_cases').insert({
        id: generateUUID(),
        title: case_.title,
        description: case_.description,
        category: case_.category,
        status: case_.status,
        priority: case_.priority,
        amount_involved: case_.amountInvolved,
        people_affected: case_.peopleAffected,
        start_date: case_.startDate,
        expected_resolution_date: case_.expectedResolutionDate,
        responsible_officials: case_.responsibleOfficials,
        current_status: case_.currentStatus,
        progress: case_.progress,
        created_at: new Date(),
        updated_at: new Date()
      });
    }
    
    // Seed polls
    console.log('🗳️ Seeding polls...');
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
    
    console.log('✅ Data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${districts.length} districts`);
    console.log(`- ${municipalities.length} municipalities`);
    console.log(`- ${wards.length} wards`);
    console.log(`- ${users.length} users`);
    console.log(`- ${politicians.length} politicians`);
    console.log(`- ${corruptionReports.length} corruption reports`);
    console.log(`- ${historicalEvents.length} historical events`);
    console.log(`- ${majorCases.length} major cases`);
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
seedAllData();
