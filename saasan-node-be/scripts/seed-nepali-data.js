const knex = require('knex');
const path = require('path');

// Database configuration
const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'saasan_db',
    user: process.env.DB_USER || 'saasan_user',
    password: process.env.DB_PASSWORD || 'saasan_password',
  },
});

// Authentic Nepali data
const nepaliData = {
  // Provinces and Districts
  provinces: [
    { id: 1, name: 'Koshi Province', name_nepali: 'कोशी प्रदेश', capital: 'Biratnagar', capital_nepali: 'विराटनगर' },
    { id: 2, name: 'Madhesh Province', name_nepali: 'मधेस प्रदेश', capital: 'Janakpur', capital_nepali: 'जनकपुर' },
    { id: 3, name: 'Bagmati Province', name_nepali: 'बागमती प्रदेश', capital: 'Hetauda', capital_nepali: 'हेटौडा' },
    { id: 4, name: 'Gandaki Province', name_nepali: 'गण्डकी प्रदेश', capital: 'Pokhara', capital_nepali: 'पोखरा' },
    { id: 5, name: 'Lumbini Province', name_nepali: 'लुम्बिनी प्रदेश', capital: 'Deukhuri', capital_nepali: 'देउखुरी' },
    { id: 6, name: 'Karnali Province', name_nepali: 'कर्णाली प्रदेश', capital: 'Birendranagar', capital_nepali: 'वीरेन्द्रनगर' },
    { id: 7, name: 'Sudurpashchim Province', name_nepali: 'सुदूरपश्चिम प्रदेश', capital: 'Godawari', capital_nepali: 'गोदावरी' }
  ],

  districts: [
    // Koshi Province
    { id: 1, name: 'Morang', name_nepali: 'मोरङ', province_id: 1 },
    { id: 2, name: 'Sunsari', name_nepali: 'सुनसरी', province_id: 1 },
    { id: 3, name: 'Jhapa', name_nepali: 'झापा', province_id: 1 },
    { id: 4, name: 'Dhankuta', name_nepali: 'धनकुटा', province_id: 1 },
    { id: 5, name: 'Terhathum', name_nepali: 'तेह्रथुम', province_id: 1 },
    
    // Madhesh Province
    { id: 6, name: 'Dhanusha', name_nepali: 'धनुषा', province_id: 2 },
    { id: 7, name: 'Mahottari', name_nepali: 'महोत्तरी', province_id: 2 },
    { id: 8, name: 'Sarlahi', name_nepali: 'सर्लाही', province_id: 2 },
    { id: 9, name: 'Siraha', name_nepali: 'सिरहा', province_id: 2 },
    { id: 10, name: 'Saptari', name_nepali: 'सप्तरी', province_id: 2 },
    
    // Bagmati Province
    { id: 11, name: 'Kathmandu', name_nepali: 'काठमाडौं', province_id: 3 },
    { id: 12, name: 'Lalitpur', name_nepali: 'ललितपुर', province_id: 3 },
    { id: 13, name: 'Bhaktapur', name_nepali: 'भक्तपुर', province_id: 3 },
    { id: 14, name: 'Kavrepalanchok', name_nepali: 'काभ्रेपलाञ्चोक', province_id: 3 },
    { id: 15, name: 'Nuwakot', name_nepali: 'नुवाकोट', province_id: 3 },
    
    // Gandaki Province
    { id: 16, name: 'Kaski', name_nepali: 'कास्की', province_id: 4 },
    { id: 17, name: 'Syangja', name_nepali: 'स्याङजा', province_id: 4 },
    { id: 18, name: 'Tanahu', name_nepali: 'तनहुँ', province_id: 4 },
    { id: 19, name: 'Lamjung', name_nepali: 'लमजुङ', province_id: 4 },
    { id: 20, name: 'Gorkha', name_nepali: 'गोरखा', province_id: 4 },
    
    // Lumbini Province
    { id: 21, name: 'Rupandehi', name_nepali: 'रुपन्देही', province_id: 5 },
    { id: 22, name: 'Kapilvastu', name_nepali: 'कपिलवस्तु', province_id: 5 },
    { id: 23, name: 'Palpa', name_nepali: 'पाल्पा', province_id: 5 },
    { id: 24, name: 'Arghakhanchi', name_nepali: 'अर्घाखाँची', province_id: 5 },
    { id: 25, name: 'Gulmi', name_nepali: 'गुल्मी', province_id: 5 },
    
    // Karnali Province
    { id: 26, name: 'Surkhet', name_nepali: 'सुर्खेत', province_id: 6 },
    { id: 27, name: 'Jumla', name_nepali: 'जुम्ला', province_id: 6 },
    { id: 28, name: 'Kalikot', name_nepali: 'कालिकोट', province_id: 6 },
    { id: 29, name: 'Mugu', name_nepali: 'मुगु', province_id: 6 },
    { id: 30, name: 'Humla', name_nepali: 'हुम्ला', province_id: 6 },
    
    // Sudurpashchim Province
    { id: 31, name: 'Kailali', name_nepali: 'कैलाली', province_id: 7 },
    { id: 32, name: 'Kanchanpur', name_nepali: 'कञ्चनपुर', province_id: 7 },
    { id: 33, name: 'Dadeldhura', name_nepali: 'डडेलधुरा', province_id: 7 },
    { id: 34, name: 'Baitadi', name_nepali: 'बैतडी', province_id: 7 },
    { id: 35, name: 'Darchula', name_nepali: 'दार्चुला', province_id: 7 }
  ],

  // Political Parties
  parties: [
    { 
      id: 1, 
      name: 'Nepal Communist Party (UML)', 
      name_nepali: 'नेपाल कम्युनिष्ट पार्टी (एमाले)', 
      description_nepali: 'नेपालको मुख्य राजनीतिक दलहरू मध्ये एक',
      symbol: '☀️', 
      color: '#FF6B35' 
    },
    { 
      id: 2, 
      name: 'Nepali Congress', 
      name_nepali: 'नेपाली काँग्रेस', 
      description_nepali: 'नेपालको प्राचीनतम र मुख्य राजनीतिक दल',
      symbol: '🌳', 
      color: '#4ECDC4' 
    },
    { 
      id: 3, 
      name: 'Maoist Centre', 
      name_nepali: 'माओवादी केन्द्र', 
      description_nepali: 'शान्ति प्रक्रिया पछि स्थापित राजनीतिक दल',
      symbol: '🔴', 
      color: '#E74C3C' 
    },
    { 
      id: 4, 
      name: 'Rastriya Prajatantra Party', 
      name_nepali: 'राष्ट्रिय प्रजातन्त्र पार्टी', 
      description_nepali: 'राजतन्त्र समर्थक राजनीतिक दल',
      symbol: '🦅', 
      color: '#9B59B6' 
    },
    { 
      id: 5, 
      name: 'Janata Samajbadi Party', 
      name_nepali: 'जनता समाजवादी पार्टी', 
      description_nepali: 'मधेसी अधिकारका लागि लड्ने दल',
      symbol: '⚖️', 
      color: '#F39C12' 
    },
    { 
      id: 6, 
      name: 'Loktantrik Samajbadi Party', 
      name_nepali: 'लोकतान्त्रिक समाजवादी पार्टी', 
      description_nepali: 'लोकतन्त्र र समाजवादका लागि कार्यरत दल',
      symbol: '🤝', 
      color: '#3498DB' 
    },
    { 
      id: 7, 
      name: 'Independent', 
      name_nepali: 'स्वतन्त्र', 
      description_nepali: 'कुनै पार्टीबाट स्वतन्त्र उम्मेदवार',
      symbol: '🦋', 
      color: '#95A5A6' 
    }
  ],

  // Politicians with authentic names and positions
  politicians: [
    // Federal Level
    {
      id: 1,
      fullName: 'Khadga Prasad Sharma Oli',
      fullNameNepali: 'खड्गप्रसाद शर्मा ओली',
      positionId: 'prime_minister',
      constituencyId: 11, // Kathmandu
      partyId: 1,
      experienceYears: 25,
      age: 72,
      education: 'Master of Arts in Political Science',
      educationNepali: 'राजनीति विज्ञानमा स्नातकोत्तर',
      previousPositions: 'Former Prime Minister, Former Chief Minister of Province 1',
      previousPositionsNepali: 'पूर्व प्रधानमन्त्री, प्रदेश १ का पूर्व मुख्यमन्त्री',
      achievements: 'Led Nepal through federal transition, Infrastructure development initiatives',
      achievementsNepali: 'संघीय संक्रमणका बेला नेपाललाई नेतृत्व, पूर्वाधार विकासका पहलहरू',
      promises: ['Complete federal restructuring', 'Economic development', 'Social justice'],
      promisesNepali: ['संघीय पुनर्गठन पूरा गर्ने', 'आर्थिक विकास', 'सामाजिक न्याय'],
      contactInfo: {
        email: 'kpsoli@parliament.gov.np',
        phone: '+977-1-4211234',
        address: 'Baluwatar, Kathmandu'
      }
    },
    {
      id: 2,
      fullName: 'Sher Bahadur Deuba',
      fullNameNepali: 'शेरबहादुर देउवा',
      positionId: 'member_parliament',
      constituencyId: 25, // Gulmi
      partyId: 2,
      experienceYears: 30,
      age: 76,
      education: 'Master of Arts in Economics',
      previousPositions: 'Former Prime Minister (4 times), Former Home Minister',
      achievements: 'Democracy restoration, Peace process leadership',
      promises: ['Democratic governance', 'Economic reforms', 'Social inclusion'],
      contactInfo: {
        email: 'sherdeuba@parliament.gov.np',
        phone: '+977-1-4215678',
        address: 'Budhanilkantha, Kathmandu'
      }
    },
    {
      id: 3,
      fullName: 'Pushpa Kamal Dahal',
      fullNameNepali: 'पुष्पकमल दाहाल',
      positionId: 'member_parliament',
      constituencyId: 21, // Rupandehi
      partyId: 3,
      experienceYears: 35,
      age: 68,
      education: 'Bachelor of Arts',
      previousPositions: 'Former Prime Minister (2 times), Maoist leader',
      achievements: 'Peace process completion, Constitution drafting',
      promises: ['Social transformation', 'Economic justice', 'Inclusive development'],
      contactInfo: {
        email: 'prachanda@parliament.gov.np',
        phone: '+977-1-4219012',
        address: 'Maharajgunj, Kathmandu'
      }
    },
    
    // Provincial Level
    {
      id: 4,
      fullName: 'Hikmat Bahadur Karki',
      fullNameNepali: 'हिकमतबहादुर कार्की',
      positionId: 'chief_minister',
      constituencyId: 1, // Morang
      partyId: 1,
      experienceYears: 20,
      age: 58,
      education: 'Master of Business Administration',
      previousPositions: 'Former Minister of Industry, Former Mayor',
      achievements: 'Industrial development in Province 1',
      promises: ['Economic growth', 'Employment generation', 'Infrastructure development'],
      contactInfo: {
        email: 'hkarki@province1.gov.np',
        phone: '+977-21-521234',
        address: 'Biratnagar, Morang'
      }
    },
    {
      id: 5,
      fullName: 'Rajendra Mahato',
      fullNameNepali: 'राजेन्द्र महतो',
      positionId: 'chief_minister',
      constituencyId: 6, // Dhanusha
      partyId: 5,
      experienceYears: 22,
      age: 55,
      education: 'Master of Arts in Political Science',
      previousPositions: 'Former Deputy Prime Minister, Former Minister',
      achievements: 'Madhesh rights advocacy, Social inclusion',
      promises: ['Madhesh development', 'Social justice', 'Regional autonomy'],
      contactInfo: {
        email: 'rmahato@madhesh.gov.np',
        phone: '+977-41-421234',
        address: 'Janakpur, Dhanusha'
      }
    },
    
    // Local Level
    {
      id: 6,
      fullName: 'Bidya Sundar Shakya',
      fullNameNepali: 'विद्या सुन्दर शाक्य',
      positionId: 'mayor',
      constituencyId: 11, // Kathmandu
      partyId: 2,
      experienceYears: 15,
      age: 48,
      education: 'Master of Engineering',
      previousPositions: 'Former Deputy Mayor, Engineer',
      achievements: 'Smart city initiatives, Waste management',
      promises: ['Smart Kathmandu', 'Clean environment', 'Digital governance'],
      contactInfo: {
        email: 'bshakya@kathmandu.gov.np',
        phone: '+977-1-4213456',
        address: 'Kathmandu Metropolitan City'
      }
    },
    {
      id: 7,
      fullName: 'Chiri Babu Maharjan',
      fullNameNepali: 'चिरी बाबु महर्जन',
      positionId: 'mayor',
      constituencyId: 12, // Lalitpur
      partyId: 1,
      experienceYears: 18,
      age: 52,
      education: 'Master of Arts in Sociology',
      previousPositions: 'Former Deputy Mayor, Social worker',
      achievements: 'Cultural preservation, Heritage management',
      promises: ['Heritage conservation', 'Cultural tourism', 'Local development'],
      contactInfo: {
        email: 'cmaharjan@lalitpur.gov.np',
        phone: '+977-1-5213456',
        address: 'Lalitpur Metropolitan City'
      }
    }
  ],

  // Current corruption cases with authentic scenarios
  corruptionCases: [
    {
      id: 1,
      title: 'Kathmandu Metropolitan City Road Construction Scam',
      titleNepali: 'काठमाडौं महानगरपालिका सडक निर्माण घोटाला',
      description: 'Investigation reveals that road construction contracts worth NPR 2.5 billion were awarded to companies without proper tender process. Roads constructed are already showing signs of damage within 6 months.',
      descriptionNepali: 'अनुसन्धानले देखाएको छ कि २.५ अर्ब रुपैयाँको सडक निर्माण ठेक्का उचित टेन्डर प्रक्रिया बिना कम्पनीहरूलाई दिइएको छ। निर्मित सडकहरू ६ महिनामै क्षतिग्रस्त देखिन थालेका छन्।',
      category: 'financial_corruption',
      priority: 'high',
      status: 'under_investigation',
      amountInvolved: 2500000000,
      location: 'Kathmandu Metropolitan City',
      districtId: 11,
      reportedBy: 'Citizen Reporter',
      referenceNumber: 'KMC-2024-001',
      evidence: [
        'Construction contract documents',
        'Photographs of damaged roads',
        'Financial audit reports',
        'Witness testimonies'
      ],
      involvedOfficials: [
        'Former Deputy Mayor',
        'Engineering Department Head',
        'Contractor Company Owner'
      ],
      timeline: [
        { date: '2023-06-01', event: 'Contract awarded' },
        { date: '2023-12-01', event: 'Construction completed' },
        { date: '2024-01-15', event: 'First complaint filed' },
        { date: '2024-02-01', event: 'Investigation started' }
      ],
      impact: 'Poor road quality affects daily commute of 500,000+ citizens, waste of public funds',
      upvotesCount: 1250,
      downvotesCount: 45
    },
    {
      id: 2,
      title: 'Province 1 Education Budget Misuse',
      titleNepali: 'प्रदेश १ शिक्षा बजेट दुरुपयोग',
      description: 'Education budget of NPR 1.8 billion allocated for school infrastructure development has been misused. Investigation shows funds were diverted to non-educational purposes.',
      descriptionNepali: 'विद्यालय पूर्वाधार विकासका लागि आवंटित १.८ अर्ब रुपैयाँको शिक्षा बजेट दुरुपयोग भएको छ। अनुसन्धानले देखाएको छ कि रकम गैर-शैक्षिक उद्देश्यका लागि मोडिएको छ।',
      category: 'financial_corruption',
      priority: 'urgent',
      status: 'under_investigation',
      amountInvolved: 1800000000,
      location: 'Province 1',
      districtId: 1,
      reportedBy: 'Teachers Union',
      referenceNumber: 'P1-EDU-2024-002',
      evidence: [
        'Budget allocation documents',
        'Bank transaction records',
        'School inspection reports',
        'Teacher testimonies'
      ],
      involvedOfficials: [
        'Provincial Education Minister',
        'District Education Officer',
        'School Management Committee Members'
      ],
      timeline: [
        { date: '2023-07-01', event: 'Budget allocated' },
        { date: '2023-12-01', event: 'Funds disbursed' },
        { date: '2024-01-01', event: 'Irregularities noticed' },
        { date: '2024-02-15', event: 'Investigation launched' }
      ],
      impact: 'Affects education quality for 200,000+ students across Province 1',
      upvotesCount: 2100,
      downvotesCount: 120
    },
    {
      id: 3,
      title: 'Pokhara Municipality Land Scam',
      titleNepali: 'पोखरा नगरपालिका जग्गा घोटाला',
      description: 'Municipal land worth NPR 500 million was illegally transferred to private developers. The land was designated for public park but sold without proper authorization.',
      descriptionNepali: '५ करोड रुपैयाँको नगरपालिकाको जग्गा गैरकानूनी रूपमा निजी विकासकर्ताहरूलाई स्थानान्तरण गरिएको छ। जग्गा सार्वजनिक पार्कका लागि निर्धारित थियो तर उचित अधिकार बिना बिक्री गरिएको छ।',
      category: 'land_corruption',
      priority: 'high',
      status: 'court_case',
      amountInvolved: 500000000,
      location: 'Pokhara Metropolitan City',
      districtId: 16,
      reportedBy: 'Environmental Activist',
      referenceNumber: 'PMC-LAND-2024-003',
      evidence: [
        'Land ownership documents',
        'Transfer deeds',
        'Municipal council minutes',
        'Environmental impact assessment'
      ],
      involvedOfficials: [
        'Mayor',
        'Land Revenue Officer',
        'Municipal Council Members',
        'Private Developer'
      ],
      timeline: [
        { date: '2023-03-01', event: 'Land designated for park' },
        { date: '2023-08-01', event: 'Illegal transfer occurred' },
        { date: '2023-12-01', event: 'Complaint filed' },
        { date: '2024-01-01', event: 'Court case filed' }
      ],
      impact: 'Loss of public green space, environmental degradation in Pokhara',
      upvotesCount: 890,
      downvotesCount: 78
    },
    {
      id: 4,
      title: 'Provincial Health Department Medicine Procurement Scam',
      titleNepali: 'प्रदेश स्वास्थ्य विभाग औषधि खरिद घोटाला',
      description: 'Health department procured substandard medicines worth NPR 800 million at inflated prices. Medicines are either expired or of poor quality, endangering public health.',
      descriptionNepali: 'स्वास्थ्य विभागले ८ करोड रुपैयाँको निम्नस्तरीय औषधि बढी मूल्यमा खरिद गरेको छ। औषधिहरू मिति नाघेका वा निम्नस्तरीय छन्, जसले सार्वजनिक स्वास्थ्यलाई जोखिममा पारेको छ।',
      category: 'health_corruption',
      priority: 'urgent',
      status: 'under_investigation',
      amountInvolved: 800000000,
      location: 'Lumbini Province',
      districtId: 21,
      reportedBy: 'Health Workers Union',
      referenceNumber: 'LP-HEALTH-2024-004',
      evidence: [
        'Procurement documents',
        'Medicine quality reports',
        'Price comparison analysis',
        'Hospital staff testimonies'
      ],
      involvedOfficials: [
        'Provincial Health Minister',
        'Procurement Officer',
        'Pharmacy Company Owner',
        'Hospital Administrator'
      ],
      timeline: [
        { date: '2023-09-01', event: 'Tender process started' },
        { date: '2023-10-01', event: 'Contract awarded' },
        { date: '2023-11-01', event: 'Medicines delivered' },
        { date: '2024-01-01', event: 'Quality issues reported' }
      ],
      impact: 'Public health risk, waste of healthcare budget, affects 1 million+ people',
      upvotesCount: 1650,
      downvotesCount: 95
    },
    {
      id: 5,
      title: 'Rural Municipality Development Fund Embezzlement',
      titleNepali: 'गाउँपालिका विकास कोष गबन',
      description: 'Development fund of NPR 300 million allocated for rural infrastructure has been embezzled by local officials. The money was supposed to build roads, schools, and health posts.',
      descriptionNepali: 'ग्रामीण पूर्वाधारका लागि आवंटित ३ करोड रुपैयाँको विकास कोष स्थानीय अधिकारीहरूले गबन गरेका छन्। यो रकम सडक, विद्यालय, र स्वास्थ्य चौकी निर्माणका लागि थियो।',
      category: 'financial_corruption',
      priority: 'medium',
      status: 'investigation_complete',
      amountInvolved: 300000000,
      location: 'Karnali Province',
      districtId: 26,
      reportedBy: 'Local Citizen',
      referenceNumber: 'KP-RURAL-2024-005',
      evidence: [
        'Fund allocation records',
        'Bank statements',
        'Construction site photos',
        'Local resident testimonies'
      ],
      involvedOfficials: [
        'Rural Municipality Chairperson',
        'Account Officer',
        'Local Development Officer'
      ],
      timeline: [
        { date: '2023-04-01', event: 'Fund allocated' },
        { date: '2023-06-01', event: 'Embezzlement started' },
        { date: '2023-12-01', event: 'Irregularities noticed' },
        { date: '2024-02-01', event: 'Investigation completed' }
      ],
      impact: 'Delayed development, poor infrastructure, affects 50,000+ rural residents',
      upvotesCount: 720,
      downvotesCount: 45
    }
  ],

  // Current trending polls with authentic Nepali issues
  trendingPolls: [
    {
      id: 1,
      title: 'Do you think the current government is handling corruption effectively?',
      titleNepali: 'के तपाईंलाई लाग्छ कि हालको सरकारले भ्रष्टाचारलाई प्रभावकारी रूपमा व्यवस्थापन गरिरहेको छ?',
      description: 'Recent corruption cases have raised questions about government effectiveness in fighting corruption.',
      descriptionNepali: 'हालका भ्रष्टाचारका मामिलाहरूले भ्रष्टाचार विरुद्ध लडाईमा सरकारको प्रभावकारिताको बारेमा प्रश्न उठाएका छन्।',
      options: [
        { id: 'yes', text: 'Yes, very effectively', textNepali: 'हो, धेरै प्रभावकारी', votes: 1250 },
        { id: 'somewhat', text: 'Somewhat effectively', textNepali: 'केही प्रभावकारी', votes: 2100 },
        { id: 'no', text: 'Not effectively', textNepali: 'प्रभावकारी छैन', votes: 3450 },
        { id: 'not_sure', text: 'Not sure', textNepali: 'थाहा छैन', votes: 800 }
      ],
      totalVotes: 7600,
      category: 'governance',
      viral_potential: 'high',
      endDate: '2024-03-15T23:59:59Z',
      createdBy: 'Citizen Poll'
    },
    {
      id: 2,
      title: 'Should politicians above 65 years be required to retire?',
      titleNepali: 'क्या ६५ वर्ष माथिका राजनीतिज्ञहरूलाई सेवानिवृत्त हुनुपर्छ?',
      description: 'Debate on age limit for political positions in Nepal.',
      descriptionNepali: 'नेपालमा राजनीतिक पदका लागि उमेर सीमाको बहस।',
      options: [
        { id: 'yes', text: 'Yes, mandatory retirement', textNepali: 'हो, अनिवार्य सेवानिवृत्ति', votes: 4200 },
        { id: 'no', text: 'No, age should not matter', textNepali: 'होइन, उमेरले केही फरक पर्दैन', votes: 2800 },
        { id: 'depends', text: 'Depends on health and performance', textNepali: 'स्वास्थ्य र प्रदर्शनमा निर्भर', votes: 1500 }
      ],
      totalVotes: 8500,
      category: 'political_reform',
      viral_potential: 'medium',
      endDate: '2024-03-20T23:59:59Z',
      createdBy: 'Youth Organization'
    },
    {
      id: 3,
      title: 'Which is the most pressing issue in Nepal today?',
      titleNepali: 'आज नेपालको सबैभन्दा जरुरी मुद्दा के हो?',
      description: 'Citizens\' opinion on the most critical issues facing Nepal.',
      descriptionNepali: 'नेपाललाई सामना गर्नुपरेका सबैभन्दा महत्वपूर्ण मुद्दाहरूमा नागरिकहरूको राय।',
      options: [
        { id: 'corruption', text: 'Corruption', textNepali: 'भ्रष्टाचार', votes: 3200 },
        { id: 'economy', text: 'Economic development', textNepali: 'आर्थिक विकास', votes: 2800 },
        { id: 'education', text: 'Education system', textNepali: 'शिक्षा प्रणाली', votes: 1800 },
        { id: 'healthcare', text: 'Healthcare', textNepali: 'स्वास्थ्य सेवा', votes: 1200 },
        { id: 'infrastructure', text: 'Infrastructure', textNepali: 'पूर्वाधार', votes: 1000 }
      ],
      totalVotes: 10000,
      category: 'social_issues',
      viral_potential: 'high',
      endDate: '2024-03-25T23:59:59Z',
      createdBy: 'Saasan Team'
    }
  ]
};

async function seedNepaliData() {
  try {
    console.log('🇳🇵 Seeding authentic Nepali data...\n');

    // Seed provinces
    console.log('📍 Seeding provinces...');
    await db('provinces').del();
    await db('provinces').insert(nepaliData.provinces);
    console.log(`✅ Inserted ${nepaliData.provinces.length} provinces`);

    // Seed districts
    console.log('🏘️ Seeding districts...');
    await db('districts').del();
    await db('districts').insert(nepaliData.districts);
    console.log(`✅ Inserted ${nepaliData.districts.length} districts`);

    // Seed political parties
    console.log('🏛️ Seeding political parties...');
    await db('political_parties').del();
    await db('political_parties').insert(nepaliData.parties);
    console.log(`✅ Inserted ${nepaliData.parties.length} political parties`);

    // Seed politicians
    console.log('👥 Seeding politicians...');
    await db('politicians').del();
    await db('politicians').insert(nepaliData.politicians);
    console.log(`✅ Inserted ${nepaliData.politicians.length} politicians`);

    // Seed corruption cases
    console.log('🚨 Seeding corruption cases...');
    await db('corruption_reports').del();
    await db('corruption_reports').insert(nepaliData.corruptionCases);
    console.log(`✅ Inserted ${nepaliData.corruptionCases.length} corruption cases`);

    // Seed trending polls
    console.log('📊 Seeding trending polls...');
    await db('polls').del();
    await db('polls').insert(nepaliData.trendingPolls.map(poll => ({
      id: poll.id,
      title: poll.title,
      title_nepali: poll.titleNepali,
      description: poll.description,
      description_nepali: poll.descriptionNepali,
      category: poll.category,
      viral_potential: poll.viral_potential,
      end_date: poll.endDate,
      created_by: poll.createdBy,
      total_votes: poll.totalVotes,
      created_at: new Date(),
      updated_at: new Date()
    })));

    // Insert poll options
    for (const poll of nepaliData.trendingPolls) {
      for (const option of poll.options) {
        await db('poll_options').insert({
          poll_id: poll.id,
          option_id: option.id,
          text: option.text,
          text_nepali: option.textNepali,
          votes: option.votes,
          created_at: new Date()
        });
      }
    }
    console.log(`✅ Inserted ${nepaliData.trendingPolls.length} trending polls`);

    // Create admin user
    console.log('👤 Creating admin user...');
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await db('users').del().where('email', 'admin@saasan.np');
    await db('users').insert({
      id: 1,
      email: 'admin@saasan.np',
      password: hashedPassword,
      full_name: 'Saasan Admin',
      role: 'admin',
      is_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    });
    console.log('✅ Created admin user (email: admin@saasan.np, password: admin123)');

    // Create sample regular users
    console.log('👥 Creating sample users...');
    const sampleUsers = [
      {
        email: 'citizen1@saasan.np',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Ram Bahadur Thapa',
        role: 'citizen',
        is_verified: true,
        created_at: new Date()
      },
      {
        email: 'citizen2@saasan.np',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Sita Devi Maharjan',
        role: 'citizen',
        is_verified: true,
        created_at: new Date()
      },
      {
        email: 'reporter@saasan.np',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Journalist Reporter',
        role: 'journalist',
        is_verified: true,
        created_at: new Date()
      }
    ];

    await db('users').insert(sampleUsers);
    console.log('✅ Created sample users');

    console.log('\n🎉 Nepali data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${nepaliData.provinces.length} Provinces`);
    console.log(`- ${nepaliData.districts.length} Districts`);
    console.log(`- ${nepaliData.parties.length} Political Parties`);
    console.log(`- ${nepaliData.politicians.length} Politicians`);
    console.log(`- ${nepaliData.corruptionCases.length} Corruption Cases`);
    console.log(`- ${nepaliData.trendingPolls.length} Trending Polls`);
    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@saasan.np / admin123');
    console.log('Citizen: citizen1@saasan.np / password123');
    console.log('Journalist: reporter@saasan.np / password123');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await db.destroy();
  }
}

// Run the seeding
if (require.main === module) {
  seedNepaliData()
    .then(() => {
      console.log('\n✅ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedNepaliData, nepaliData };
