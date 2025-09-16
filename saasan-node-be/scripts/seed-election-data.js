const db = require('../src/config/database');

// Comprehensive Election Data for Nepal 2027
const electionData = {
  federalConstituencies: [
    // Kathmandu Valley
    { id: 1, name: "Kathmandu-1", nameNepali: "काठमाडौं-१", province: "Bagmati", totalVoters: 45000 },
    { id: 2, name: "Kathmandu-2", nameNepali: "काठमाडौं-२", province: "Bagmati", totalVoters: 42000 },
    { id: 3, name: "Kathmandu-3", nameNepali: "काठमाडौं-३", province: "Bagmati", totalVoters: 48000 },
    { id: 4, name: "Lalitpur-1", nameNepali: "ललितपुर-१", province: "Bagmati", totalVoters: 38000 },
    { id: 5, name: "Bhaktapur", nameNepali: "भक्तपुर", province: "Bagmati", totalVoters: 35000 },
    
    // Other major constituencies
    { id: 6, name: "Pokhara-1", nameNepali: "पोखरा-१", province: "Gandaki", totalVoters: 40000 },
    { id: 7, name: "Bharatpur", nameNepali: "भरतपुर", province: "Bagmati", totalVoters: 42000 },
    { id: 8, name: "Birgunj", nameNepali: "बिरगञ्ज", province: "Madhesh", totalVoters: 45000 },
    { id: 9, name: "Biratnagar", nameNepali: "विराटनगर", province: "Koshi", totalVoters: 43000 },
    { id: 10, name: "Nepalgunj", nameNepali: "नेपालगञ्ज", province: "Lumbini", totalVoters: 38000 }
  ],

  candidates: [
    // Kathmandu-1 Candidates
    {
      politicianId: 1,
      constituencyId: 1,
      partyId: 1,
      candidateNumber: 1,
      symbol: "Lotus",
      symbolNepali: "कमल",
      manifesto: "Digital Nepal, Green Energy, Youth Employment",
      manifestoNepali: "डिजिटल नेपाल, हरित ऊर्जा, युवा रोजगार",
      keyPromises: [
        "Free WiFi in all public places",
        "Solar power for every household",
        "Tech startup incubation centers",
        "Digital governance system"
      ],
      keyPromisesNepali: [
        "सबै सार्वजनिक स्थानमा निःशुल्क वाईफाई",
        "हरेक घरमा सोलर पावर",
        "टेक स्टार्टअप इन्कुबेसन सेन्टर",
        "डिजिटल शासन प्रणाली"
      ],
      educationBackground: "PhD in Computer Science, Harvard University",
      educationBackgroundNepali: "कम्प्युटर साइन्समा पिएचडी, हार्वर्ड विश्वविद्यालय",
      professionalExperience: "Tech entrepreneur, former CTO of major tech companies",
      professionalExperienceNepali: "टेक उद्यमी, प्रमुख टेक कम्पनीहरूका पूर्व सीटीओ"
    },
    {
      politicianId: 2,
      constituencyId: 1,
      partyId: 2,
      candidateNumber: 2,
      symbol: "Tree",
      symbolNepali: "रूख",
      manifesto: "Environmental Protection, Sustainable Development",
      manifestoNepali: "वातावरण संरक्षण, टिकाऊ विकास",
      keyPromises: [
        "Green city initiative",
        "Waste management system",
        "Electric public transport",
        "Tree plantation campaign"
      ],
      keyPromisesNepali: [
        "हरित शहर पहल",
        "कचरा व्यवस्थापन प्रणाली",
        "बिजुली सार्वजनिक यातायात",
        "रूख रोपाइ अभियान"
      ],
      educationBackground: "Masters in Environmental Science, Tribhuvan University",
      educationBackgroundNepali: "वातावरण विज्ञानमा स्नातकोत्तर, त्रिभुवन विश्वविद्यालय",
      professionalExperience: "Environmental activist, NGO founder",
      professionalExperienceNepali: "वातावरण कार्यकर्ता, गैरसरकारी संस्था संस्थापक"
    },

    // Kathmandu-2 Candidates
    {
      politicianId: 3,
      constituencyId: 2,
      partyId: 1,
      candidateNumber: 1,
      symbol: "Star",
      symbolNepali: "तारा",
      manifesto: "Economic Growth, Infrastructure Development",
      manifestoNepali: "आर्थिक वृद्धि, पूर्वाधार विकास",
      keyPromises: [
        "Metro rail system",
        "Smart city development",
        "Foreign investment attraction",
        "Industrial zones"
      ],
      keyPromisesNepali: [
        "मेट्रो रेल प्रणाली",
        "स्मार्ट शहर विकास",
        "विदेशी लगानी आकर्षण",
        "औद्योगिक क्षेत्र"
      ],
      educationBackground: "MBA in Economics, London School of Economics",
      educationBackgroundNepali: "अर्थशास्त्रमा एमबिए, लन्डन स्कूल अफ इकोनोमिक्स",
      professionalExperience: "Investment banker, economic consultant",
      professionalExperienceNepali: "लगानी बैंकर, आर्थिक सल्लाहकार"
    }
  ],

  votingSessions: [
    {
      electionType: "federal",
      electionYear: 2027,
      constituencyId: 1,
      sessionName: "Federal Election 2027 - Kathmandu-1",
      sessionNameNepali: "संघीय निर्वाचन २०२७ - काठमाडौं-१",
      startDate: "2027-05-15 07:00:00",
      endDate: "2027-05-15 17:00:00",
      totalEligibleVoters: 45000,
      isActive: true
    },
    {
      electionType: "provincial",
      electionYear: 2027,
      constituencyId: 1,
      sessionName: "Provincial Election 2027 - Kathmandu-1",
      sessionNameNepali: "प्रदेशीय निर्वाचन २०२७ - काठमाडौं-१",
      startDate: "2027-05-15 07:00:00",
      endDate: "2027-05-15 17:00:00",
      totalEligibleVoters: 45000,
      isActive: true
    }
  ],

  votingCenters: [
    {
      name: "Kathmandu Model Secondary School",
      nameNepali: "काठमाडौं मोडेल माध्यमिक विद्यालय",
      address: "Kathmandu Metropolitan City, Ward No. 1",
      addressNepali: "काठमाडौं महानगरपालिका, वडा नं. १",
      constituencyId: 1,
      wardId: 1,
      latitude: 27.7172,
      longitude: 85.3240,
      capacity: 500,
      facilities: ["wheelchair_access", "parking", "restroom", "drinking_water"],
      contactPerson: "Ram Prasad Sharma",
      contactNumber: "9841234567"
    },
    {
      name: "Birendra International Convention Centre",
      nameNepali: "वीरेन्द्र अन्तर्राष्ट्रिय सम्मेलन केन्द्र",
      address: "Kathmandu Metropolitan City, Ward No. 2",
      addressNepali: "काठमाडौं महानगरपालिका, वडा नं. २",
      constituencyId: 1,
      wardId: 2,
      latitude: 27.7152,
      longitude: 85.3290,
      capacity: 1000,
      facilities: ["wheelchair_access", "parking", "restroom", "drinking_water", "ac"],
      contactPerson: "Sita Devi Maharjan",
      contactNumber: "9847654321"
    }
  ]
};

async function seedElectionData() {
  try {
    console.log('🌱 Starting election data seeding...');

    // Seed Federal Constituencies
    console.log('📊 Seeding federal constituencies...');
    for (const constituency of electionData.federalConstituencies) {
      await db('constituencies').insert({
        id: constituency.id,
        name: constituency.name,
        name_nepali: constituency.nameNepali,
        province_id: 3, // Bagmati Province
        total_voters: constituency.totalVoters,
        created_at: new Date(),
        updated_at: new Date()
      }).onConflict('id').ignore();
    }

    // Seed Election Candidates
    console.log('👥 Seeding election candidates...');
    for (const candidate of electionData.candidates) {
      await db('election_candidates').insert({
        politician_id: candidate.politicianId,
        election_type: 'federal',
        election_year: 2027,
        constituency_id: candidate.constituencyId,
        party_id: candidate.partyId,
        candidate_number: candidate.candidateNumber,
        symbol: candidate.symbol,
        symbol_nepali: candidate.symbolNepali,
        manifesto: candidate.manifesto,
        manifesto_nepali: candidate.manifestoNepali,
        key_promises: candidate.keyPromises,
        key_promises_nepali: candidate.keyPromisesNepali,
        education_background: candidate.educationBackground,
        education_background_nepali: candidate.educationBackgroundNepali,
        professional_experience: candidate.professionalExperience,
        professional_experience_nepali: candidate.professionalExperienceNepali,
        is_active: true,
        vote_count: 0,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    // Seed Voting Sessions
    console.log('🗳️ Seeding voting sessions...');
    for (const session of electionData.votingSessions) {
      await db('voting_sessions').insert({
        election_type: session.electionType,
        election_year: session.electionYear,
        constituency_id: session.constituencyId,
        session_name: session.sessionName,
        session_name_nepali: session.sessionNameNepali,
        start_date: session.startDate,
        end_date: session.endDate,
        total_eligible_voters: session.totalEligibleVoters,
        is_active: session.isActive,
        total_votes_cast: 0,
        results_published: false,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    // Seed Voting Centers
    console.log('🏛️ Seeding voting centers...');
    for (const center of electionData.votingCenters) {
      await db('voting_centers').insert({
        name: center.name,
        name_nepali: center.nameNepali,
        address: center.address,
        address_nepali: center.addressNepali,
        constituency_id: center.constituencyId,
        ward_id: center.wardId,
        latitude: center.latitude,
        longitude: center.longitude,
        capacity: center.capacity,
        facilities: center.facilities,
        contact_person: center.contactPerson,
        contact_number: center.contactNumber,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    // Seed Sample Voter Registrations
    console.log('📝 Seeding sample voter registrations...');
    const sampleRegistrations = [
      {
        user_id: 1,
        constituency_id: 1,
        ward_id: 1,
        registration_number: 'KTM-001-2027',
        verification_status: 'verified'
      },
      {
        user_id: 2,
        constituency_id: 1,
        ward_id: 2,
        registration_number: 'KTM-002-2027',
        verification_status: 'pending'
      },
      {
        user_id: 3,
        constituency_id: 2,
        ward_id: 3,
        registration_number: 'KTM-003-2027',
        verification_status: 'verified'
      }
    ];

    for (const registration of sampleRegistrations) {
      await db('voter_registrations').insert({
        ...registration,
        registration_date: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    // Seed Sample Voter Intent Surveys
    console.log('📊 Seeding sample voter intent surveys...');
    const sampleSurveys = [
      {
        user_id: 1,
        constituency_id: 1,
        return_intent: 'returning',
        return_reason: 'Family responsibility and civic duty',
        voting_intent: 'will_vote',
        preferred_candidate_id: 1,
        concerns: ['corruption', 'economic_development'],
        suggestions: 'Focus on youth employment and digital infrastructure'
      },
      {
        user_id: 2,
        constituency_id: 1,
        return_intent: 'unsure',
        return_reason: 'Work commitments abroad',
        voting_intent: 'might_vote',
        concerns: ['travel_cost', 'time_off_work'],
        suggestions: 'Provide remote voting options or travel assistance'
      },
      {
        user_id: 3,
        constituency_id: 2,
        return_intent: 'cannot',
        return_reason: 'Financial constraints',
        voting_intent: 'will_not_vote',
        concerns: ['travel_cost', 'lost_income'],
        suggestions: 'Government should provide travel assistance for voters'
      }
    ];

    for (const survey of sampleSurveys) {
      await db('voter_intent_surveys').insert({
        ...survey,
        survey_date: new Date(),
        created_at: new Date()
      });
    }

    console.log('✅ Election data seeding completed successfully!');
    console.log('📈 Seeded:');
    console.log(`   - ${electionData.federalConstituencies.length} federal constituencies`);
    console.log(`   - ${electionData.candidates.length} election candidates`);
    console.log(`   - ${electionData.votingSessions.length} voting sessions`);
    console.log(`   - ${electionData.votingCenters.length} voting centers`);
    console.log(`   - ${sampleRegistrations.length} voter registrations`);
    console.log(`   - ${sampleSurveys.length} voter intent surveys`);

  } catch (error) {
    console.error('❌ Error seeding election data:', error);
    throw error;
  }
}

// Run the seeding
if (require.main === module) {
  seedElectionData()
    .then(() => {
      console.log('🎉 Election data seeding process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Election data seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedElectionData, electionData };
