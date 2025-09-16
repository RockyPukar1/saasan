const db = require('../src/config/database');

// Comprehensive Nepali Data with English and Nepali Together
const completeData = {
  provinces: [
    { id: 1, name: "Koshi Province", nameNepali: "कोशी प्रदेश", capital: "Biratnagar", capitalNepali: "विराटनगर" },
    { id: 2, name: "Madhesh Province", nameNepali: "मधेश प्रदेश", capital: "Janakpur", capitalNepali: "जनकपुर" },
    { id: 3, name: "Bagmati Province", nameNepali: "बागमती प्रदेश", capital: "Kathmandu", capitalNepali: "काठमाडौं" },
    { id: 4, name: "Gandaki Province", nameNepali: "गण्डकी प्रदेश", capital: "Pokhara", capitalNepali: "पोखरा" },
    { id: 5, name: "Lumbini Province", nameNepali: "लुम्बिनी प्रदेश", capital: "Deukhuri", capitalNepali: "देउखुरी" },
    { id: 6, name: "Karnali Province", nameNepali: "कर्णाली प्रदेश", capital: "Birendranagar", capitalNepali: "वीरेन्द्रनगर" },
    { id: 7, name: "Sudurpashchim Province", nameNepali: "सुदूरपश्चिम प्रदेश", capital: "Dhangadhi", capitalNepali: "धनगढी" }
  ],

  districts: [
    // Bagmati Province
    { id: 1, name: "Kathmandu", nameNepali: "काठमाडौं", provinceId: 3 },
    { id: 2, name: "Lalitpur", nameNepali: "ललितपुर", provinceId: 3 },
    { id: 3, name: "Bhaktapur", nameNepali: "भक्तपुर", provinceId: 3 },
    { id: 4, name: "Chitwan", nameNepali: "चितवन", provinceId: 3 },
    { id: 5, name: "Makwanpur", nameNepali: "मकवानपुर", provinceId: 3 },
    // Gandaki Province
    { id: 6, name: "Kaski", nameNepali: "कास्की", provinceId: 4 },
    { id: 7, name: "Syangja", nameNepali: "स्याङ्जा", provinceId: 4 },
    // Lumbini Province
    { id: 8, name: "Banke", nameNepali: "बाँके", provinceId: 5 },
    { id: 9, name: "Bardiya", nameNepali: "बर्दिया", provinceId: 5 },
    // Koshi Province
    { id: 10, name: "Morang", nameNepali: "मोरङ", provinceId: 1 },
    { id: 11, name: "Sunsari", nameNepali: "सुनसरी", provinceId: 1 }
  ],

  constituencies: [
    { id: 1, name: "Kathmandu-1", nameNepali: "काठमाडौं-१", districtId: 1, provinceId: 3, totalVoters: 45000 },
    { id: 2, name: "Kathmandu-2", nameNepali: "काठमाडौं-२", districtId: 1, provinceId: 3, totalVoters: 42000 },
    { id: 3, name: "Kathmandu-3", nameNepali: "काठमाडौं-३", districtId: 1, provinceId: 3, totalVoters: 48000 },
    { id: 4, name: "Lalitpur-1", nameNepali: "ललितपुर-१", districtId: 2, provinceId: 3, totalVoters: 38000 },
    { id: 5, name: "Bhaktapur", nameNepali: "भक्तपुर", districtId: 3, provinceId: 3, totalVoters: 35000 },
    { id: 6, name: "Pokhara-1", nameNepali: "पोखरा-१", districtId: 6, provinceId: 4, totalVoters: 40000 },
    { id: 7, name: "Chitwan", nameNepali: "चितवन", districtId: 4, provinceId: 3, totalVoters: 42000 },
    { id: 8, name: "Biratnagar", nameNepali: "विराटनगर", districtId: 10, provinceId: 1, totalVoters: 43000 },
    { id: 9, name: "Nepalgunj", nameNepali: "नेपालगञ्ज", districtId: 8, provinceId: 5, totalVoters: 38000 }
  ],

  politicalParties: [
    {
      id: 1,
      name: "Nepal Communist Party (Unified Marxist-Leninist)",
      nameNepali: "नेपाल कम्युनिस्ट पार्टी (एकीकृत मार्क्सवादी-लेनिनवादी)",
      abbreviation: "CPN-UML",
      abbreviationNepali: "नेकपा-एमाले",
      ideology: "Communism",
      ideologyNepali: "कम्युनिज्म",
      foundedYear: 2021,
      logoUrl: "https://example.com/cpn-uml-logo.png",
      color: "#FF0000"
    },
    {
      id: 2,
      name: "Nepali Congress",
      nameNepali: "नेपाली कांग्रेस",
      abbreviation: "NC",
      abbreviationNepali: "नेकां",
      ideology: "Social Democracy",
      ideologyNepali: "सामाजिक लोकतन्त्र",
      foundedYear: 1950,
      logoUrl: "https://example.com/nc-logo.png",
      color: "#0066CC"
    },
    {
      id: 3,
      name: "Maoist Center",
      nameNepali: "माओवादी केन्द्र",
      abbreviation: "MC",
      abbreviationNepali: "माके",
      ideology: "Maoism",
      ideologyNepali: "माओवाद",
      foundedYear: 1994,
      logoUrl: "https://example.com/mc-logo.png",
      color: "#FF6600"
    },
    {
      id: 4,
      name: "Rastriya Prajatantra Party",
      nameNepali: "राष्ट्रिय प्रजातन्त्र पार्टी",
      abbreviation: "RPP",
      abbreviationNepali: "राप्रपा",
      ideology: "Monarchism",
      ideologyNepali: "राजतन्त्रवाद",
      foundedYear: 1990,
      logoUrl: "https://example.com/rpp-logo.png",
      color: "#FFD700"
    },
    {
      id: 5,
      name: "Janata Samajwadi Party",
      nameNepali: "जनता समाजवादी पार्टी",
      abbreviation: "JSP",
      abbreviationNepali: "जसपा",
      ideology: "Socialism",
      ideologyNepali: "समाजवाद",
      foundedYear: 2020,
      logoUrl: "https://example.com/jsp-logo.png",
      color: "#00AA00"
    }
  ],

  politicians: [
    {
      id: 1,
      fullName: "Dr. Rajesh Sharma",
      fullNameNepali: "डा. राजेश शर्मा",
      age: 45,
      education: "PhD in Computer Science, Harvard University",
      educationNepali: "कम्प्युटर साइन्समा पिएचडी, हार्वर्ड विश्वविद्यालय",
      profession: "Technology Entrepreneur",
      professionNepali: "प्रविधि उद्यमी",
      constituencyId: 1,
      partyId: 1,
      position: "Member of Parliament",
      positionNepali: "संसद सदस्य",
      experienceYears: 8,
      photoUrl: "https://example.com/rajesh-sharma.jpg",
      isActive: true,
      rating: 4.2,
      totalReports: 12,
      verifiedReports: 8
    },
    {
      id: 2,
      fullName: "Sita Maharjan",
      fullNameNepali: "सीता महर्जन",
      age: 38,
      education: "Masters in Environmental Science, Tribhuvan University",
      educationNepali: "वातावरण विज्ञानमा स्नातकोत्तर, त्रिभुवन विश्वविद्यालय",
      profession: "Environmental Activist",
      professionNepali: "वातावरण कार्यकर्ता",
      constituencyId: 1,
      partyId: 2,
      position: "Member of Parliament",
      positionNepali: "संसद सदस्य",
      experienceYears: 5,
      photoUrl: "https://example.com/sita-maharjan.jpg",
      isActive: true,
      rating: 4.5,
      totalReports: 8,
      verifiedReports: 6
    },
    {
      id: 3,
      fullName: "Ram Prasad Yadav",
      fullNameNepali: "राम प्रसाद यादव",
      age: 52,
      education: "MBA in Economics, London School of Economics",
      educationNepali: "अर्थशास्त्रमा एमबिए, लन्डन स्कूल अफ इकोनोमिक्स",
      profession: "Investment Banker",
      professionNepali: "लगानी बैंकर",
      constituencyId: 2,
      partyId: 1,
      position: "Member of Parliament",
      positionNepali: "संसद सदस्य",
      experienceYears: 12,
      photoUrl: "https://example.com/ram-yadav.jpg",
      isActive: true,
      rating: 3.8,
      totalReports: 15,
      verifiedReports: 10
    },
    {
      id: 4,
      fullName: "Gita Thapa",
      fullNameNepali: "गीता थापा",
      age: 41,
      education: "Masters in Public Administration, Tribhuvan University",
      educationNepali: "सार्वजनिक प्रशासनमा स्नातकोत्तर, त्रिभुवन विश्वविद्यालय",
      profession: "Civil Servant",
      professionNepali: "सरकारी कर्मचारी",
      constituencyId: 4,
      partyId: 2,
      position: "Provincial Assembly Member",
      positionNepali: "प्रदेश सभा सदस्य",
      experienceYears: 6,
      photoUrl: "https://example.com/gita-thapa.jpg",
      isActive: true,
      rating: 4.1,
      totalReports: 6,
      verifiedReports: 4
    },
    {
      id: 5,
      fullName: "Krishna Bahadur Mahara",
      fullNameNepali: "कृष्ण बहादुर महरा",
      age: 67,
      education: "Bachelor in Political Science, Tribhuvan University",
      educationNepali: "राजनीति विज्ञानमा स्नातक, त्रिभुवन विश्वविद्यालय",
      profession: "Politician",
      professionNepali: "राजनीतिज्ञ",
      constituencyId: 6,
      partyId: 3,
      position: "Member of Parliament",
      positionNepali: "संसद सदस्य",
      experienceYears: 25,
      photoUrl: "https://example.com/krishna-mahara.jpg",
      isActive: true,
      rating: 2.8,
      totalReports: 25,
      verifiedReports: 18
    }
  ],

  electionCandidates: [
    {
      politicianId: 1,
      electionType: "federal",
      electionYear: 2027,
      constituencyId: 1,
      partyId: 1,
      candidateNumber: 1,
      symbol: "Lotus",
      symbolNepali: "कमल",
      manifesto: "Digital Nepal, Green Energy, Youth Employment, Anti-Corruption",
      manifestoNepali: "डिजिटल नेपाल, हरित ऊर्जा, युवा रोजगार, भ्रष्टाचार विरोध",
      keyPromises: [
        "Free WiFi in all public places within 2 years",
        "Solar power for every household by 2030",
        "Tech startup incubation centers in all provinces",
        "Digital governance system for transparency",
        "Zero tolerance for corruption"
      ],
      keyPromisesNepali: [
        "२ वर्षभित्र सबै सार्वजनिक स्थानमा निःशुल्क वाईफाई",
        "२०३० सम्म हरेक घरमा सोलर पावर",
        "सबै प्रदेशमा टेक स्टार्टअप इन्कुबेसन सेन्टर",
        "पारदर्शिताका लागि डिजिटल शासन प्रणाली",
        "भ्रष्टाचारका लागि शून्य सहनशीलता"
      ],
      educationBackground: "PhD in Computer Science from Harvard University, 15 years in tech industry",
      educationBackgroundNepali: "हार्वर्ड विश्वविद्यालयबाट कम्प्युटर साइन्समा पिएचडी, १५ वर्ष टेक उद्योगमा",
      professionalExperience: "Former CTO of major tech companies, founded 3 successful startups",
      professionalExperienceNepali: "प्रमुख टेक कम्पनीहरूका पूर्व सीटीओ, ३ सफल स्टार्टअप स्थापना",
      voteCount: 1250,
      isActive: true
    },
    {
      politicianId: 2,
      electionType: "federal",
      electionYear: 2027,
      constituencyId: 1,
      partyId: 2,
      candidateNumber: 2,
      symbol: "Tree",
      symbolNepali: "रूख",
      manifesto: "Environmental Protection, Sustainable Development, Women Empowerment",
      manifestoNepali: "वातावरण संरक्षण, टिकाऊ विकास, महिला सशक्तिकरण",
      keyPromises: [
        "Green city initiative for Kathmandu Valley",
        "Comprehensive waste management system",
        "Electric public transport network",
        "Million tree plantation campaign",
        "Clean air and water for all"
      ],
      keyPromisesNepali: [
        "काठमाडौं उपत्यकाका लागि हरित शहर पहल",
        "व्यापक कचरा व्यवस्थापन प्रणाली",
        "बिजुली सार्वजनिक यातायात जाल",
        "लाखौं रूख रोपाइ अभियान",
        "सबैका लागि सफा हावा र पानी"
      ],
      educationBackground: "Masters in Environmental Science, 12 years in environmental activism",
      educationBackgroundNepali: "वातावरण विज्ञानमा स्नातकोत्तर, १२ वर्ष वातावरण कार्यक्रममा",
      professionalExperience: "Environmental activist, NGO founder, UN consultant",
      professionalExperienceNepali: "वातावरण कार्यकर्ता, गैरसरकारी संस्था संस्थापक, संयुक्त राष्ट्र सल्लाहकार",
      voteCount: 980,
      isActive: true
    }
  ],

  polls: [
    {
      title: "Should corruption cases be made public immediately?",
      titleNepali: "भ्रष्टाचारका मामिला तुरुन्तै सार्वजनिक गर्नुपर्छ?",
      description: "A poll about transparency in corruption cases and public access to information",
      descriptionNepali: "भ्रष्टाचारका मामिलामा पारदर्शिता र जानकारीमा सार्वजनिक पहुँचको बारेमा सर्वेक्षण",
      category: "Governance",
      categoryNepali: "शासन",
      constituencyId: 1,
      createdBy: 1,
      totalVotes: 1250,
      isActive: true,
      options: [
        {
          optionText: "Yes, always public",
          optionTextNepali: "हो, सधैं सार्वजनिक",
          voteCount: 800
        },
        {
          optionText: "No, keep private",
          optionTextNepali: "होइन, निजी राख्नुहोस्",
          voteCount: 450
        }
      ]
    },
    {
      title: "Which sector needs immediate anti-corruption measures?",
      titleNepali: "कुन क्षेत्रमा तुरुन्तै भ्रष्टाचार विरोधी उपायहरू चाहिन्छ?",
      description: "Priority sectors for anti-corruption interventions",
      descriptionNepali: "भ्रष्टाचार विरोधी हस्तक्षेपका लागि प्राथमिकता क्षेत्रहरू",
      category: "Anti-Corruption",
      categoryNepali: "भ्रष्टाचार विरोध",
      constituencyId: 1,
      createdBy: 2,
      totalVotes: 980,
      isActive: true,
      options: [
        {
          optionText: "Construction & Infrastructure",
          optionTextNepali: "निर्माण र पूर्वाधार",
          voteCount: 320
        },
        {
          optionText: "Healthcare",
          optionTextNepali: "स्वास्थ्य सेवा",
          voteCount: 280
        },
        {
          optionText: "Education",
          optionTextNepali: "शिक्षा",
          voteCount: 200
        },
        {
          optionText: "Government Procurement",
          optionTextNepali: "सरकारी खरिद",
          voteCount: 180
        }
      ]
    }
  ],

  reports: [
    {
      title: "Highway Construction Corruption Exposed",
      titleNepali: "राजमार्ग निर्माण भ्रष्टाचार खुलासा",
      description: "Funds allocated for highway construction were allegedly misused by contractors and local officials. Evidence shows overpricing and substandard materials.",
      descriptionNepali: "राजमार्ग निर्माणका लागि आवंटित रकम ठेकेदार र स्थानीय अधिकारीहरूले दुरुपयोग गरेको आरोप। प्रमाणले अधिक मूल्य निर्धारण र निम्नस्तरीय सामग्री देखाउँछ।",
      category: "Infrastructure",
      categoryNepali: "पूर्वाधार",
      constituencyId: 1,
      reportedBy: 1,
      amountInvolved: 50000000,
      status: "verified",
      priority: "urgent",
      upvotesCount: 325,
      downvotesCount: 45,
      referenceNumber: "HC-2024-001",
      tags: ["construction", "corruption", "highway"],
      tagsNepali: ["निर्माण", "भ्रष्टाचार", "राजमार्ग"]
    },
    {
      title: "Hospital Equipment Procurement Fraud",
      titleNepali: "अस्पताल उपकरण खरिद धोखाधडी",
      description: "Medical equipment procurement was overpriced by 200%, causing shortage in rural hospitals and affecting patient care.",
      descriptionNepali: "चिकित्सा उपकरण खरिद २००% अधिक मूल्यमा गरिएको, ग्रामीण अस्पतालहरूमा कमी आएर रोगी हेरचाहमा असर परेको।",
      category: "Healthcare",
      categoryNepali: "स्वास्थ्य सेवा",
      constituencyId: 2,
      reportedBy: 2,
      amountInvolved: 15000000,
      status: "under_review",
      priority: "high",
      upvotesCount: 212,
      downvotesCount: 28,
      referenceNumber: "HF-2024-013",
      tags: ["healthcare", "fraud", "equipment"],
      tagsNepali: ["स्वास्थ्य सेवा", "धोखाधडी", "उपकरण"]
    }
  ],

  badges: [
    {
      name: "First Reporter",
      nameNepali: "पहिलो रिपोर्टर",
      description: "Submitted your first corruption report",
      descriptionNepali: "तपाईंको पहिलो भ्रष्टाचार रिपोर्ट पेश गर्नुभयो",
      category: "reporter",
      rarity: "common",
      maxProgress: 1
    },
    {
      name: "Veteran Reporter",
      nameNepali: "अनुभवी रिपोर्टर",
      description: "Submitted 10+ corruption reports",
      descriptionNepali: "१०+ भ्रष्टाचार रिपोर्टहरू पेश गर्नुभयो",
      category: "reporter",
      rarity: "rare",
      maxProgress: 10
    },
    {
      name: "Truth Seeker",
      nameNepali: "सत्य खोजी",
      description: "Had 5 reports verified by community",
      descriptionNepali: "समुदायद्वारा ५ रिपोर्टहरू प्रमाणित गरिए",
      category: "reporter",
      rarity: "rare",
      maxProgress: 5
    },
    {
      name: "First Voter",
      nameNepali: "पहिलो मतदाता",
      description: "Voted on your first poll",
      descriptionNepali: "तपाईंको पहिलो मतदानमा भाग लिनुभयो",
      category: "voter",
      rarity: "common",
      maxProgress: 1
    },
    {
      name: "Active Citizen",
      nameNepali: "सक्रिय नागरिक",
      description: "Voted on 25 polls",
      descriptionNepali: "२५ मतदानमा भाग लिनुभयो",
      category: "voter",
      rarity: "rare",
      maxProgress: 25
    },
    {
      name: "Community Supporter",
      nameNepali: "समुदाय समर्थक",
      description: "Upvoted 100 reports",
      descriptionNepali: "१०० रिपोर्टहरूमा मत दिनुभयो",
      category: "community",
      rarity: "rare",
      maxProgress: 100
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
    }
  ],

  voterRegistrations: [
    {
      userId: 1,
      constituencyId: 1,
      wardId: 1,
      registrationNumber: "KTM-001-2027",
      verificationStatus: "verified"
    },
    {
      userId: 2,
      constituencyId: 1,
      wardId: 2,
      registrationNumber: "KTM-002-2027",
      verificationStatus: "pending"
    }
  ],

  voterSurveys: [
    {
      userId: 1,
      constituencyId: 1,
      returnIntent: "returning",
      returnReason: "Family responsibility and civic duty to participate in democracy",
      returnReasonNepali: "परिवारको जिम्मेवारी र लोकतन्त्रमा सहभागिताको नागरिक कर्तव्य",
      votingIntent: "will_vote",
      preferredCandidateId: 1,
      concerns: ["corruption", "economic_development"],
      concernsNepali: ["भ्रष्टाचार", "आर्थिक विकास"],
      suggestions: "Focus on youth employment and digital infrastructure development",
      suggestionsNepali: "युवा रोजगार र डिजिटल पूर्वाधार विकासमा ध्यान दिनुहोस्"
    },
    {
      userId: 2,
      constituencyId: 1,
      returnIntent: "unsure",
      returnReason: "Work commitments abroad and travel costs",
      returnReasonNepali: "विदेशमा कामको जिम्मेवारी र यात्रा खर्च",
      votingIntent: "might_vote",
      concerns: ["travel_cost", "time_off_work"],
      concernsNepali: ["यात्रा खर्च", "कामबाट छुट्टी"],
      suggestions: "Provide remote voting options or travel assistance for overseas voters",
      suggestionsNepali: "विदेशी मतदाताहरूका लागि दूरस्थ मतदान विकल्प वा यात्रा सहयोग उपलब्ध गराउनुहोस्"
    }
  ]
};

async function seedCompleteData() {
  try {
    console.log('🌱 Starting comprehensive data seeding...');

    // Seed Provinces
    console.log('📍 Seeding provinces...');
    for (const province of completeData.provinces) {
      await db('provinces').insert(province).onConflict('id').ignore();
    }

    // Seed Districts
    console.log('🏘️ Seeding districts...');
    for (const district of completeData.districts) {
      await db('districts').insert(district).onConflict('id').ignore();
    }

    // Seed Constituencies
    console.log('🗳️ Seeding constituencies...');
    for (const constituency of completeData.constituencies) {
      await db('constituencies').insert(constituency).onConflict('id').ignore();
    }

    // Seed Political Parties
    console.log('🏛️ Seeding political parties...');
    for (const party of completeData.politicalParties) {
      await db('political_parties').insert(party).onConflict('id').ignore();
    }

    // Seed Politicians
    console.log('👥 Seeding politicians...');
    for (const politician of completeData.politicians) {
      await db('politicians').insert(politician).onConflict('id').ignore();
    }

    // Seed Election Candidates
    console.log('🎯 Seeding election candidates...');
    for (const candidate of completeData.electionCandidates) {
      await db('election_candidates').insert(candidate);
    }

    // Seed Polls with Options
    console.log('📊 Seeding polls...');
    for (const poll of completeData.polls) {
      const [pollResult] = await db('polls').insert({
        title: poll.title,
        title_nepali: poll.titleNepali,
        description: poll.description,
        description_nepali: poll.descriptionNepali,
        category: poll.category,
        category_nepali: poll.categoryNepali,
        constituency_id: poll.constituencyId,
        created_by: poll.createdBy,
        total_votes: poll.totalVotes,
        is_active: poll.isActive,
        created_at: new Date()
      }).returning('id');

      // Insert poll options
      for (const option of poll.options) {
        await db('poll_options').insert({
          poll_id: pollResult.id,
          option_text: option.optionText,
          option_text_nepali: option.optionTextNepali,
          vote_count: option.voteCount
        });
      }
    }

    // Seed Reports
    console.log('📰 Seeding corruption reports...');
    for (const report of completeData.reports) {
      await db('reports').insert({
        title: report.title,
        title_nepali: report.titleNepali,
        description: report.description,
        description_nepali: report.descriptionNepali,
        category: report.category,
        category_nepali: report.categoryNepali,
        constituency_id: report.constituencyId,
        reported_by: report.reportedBy,
        amount_involved: report.amountInvolved,
        status: report.status,
        priority: report.priority,
        upvotes_count: report.upvotesCount,
        downvotes_count: report.downvotesCount,
        reference_number: report.referenceNumber,
        tags: report.tags,
        tags_nepali: report.tagsNepali,
        created_at: new Date()
      });
    }

    // Seed Badges
    console.log('🏆 Seeding badges...');
    for (const badge of completeData.badges) {
      await db('badges').insert({
        name: badge.name,
        name_nepali: badge.nameNepali,
        description: badge.description,
        description_nepali: badge.descriptionNepali,
        category: badge.category,
        rarity: badge.rarity,
        max_progress: badge.maxProgress,
        created_at: new Date()
      });
    }

    // Seed Voting Sessions
    console.log('🗳️ Seeding voting sessions...');
    for (const session of completeData.votingSessions) {
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
        created_at: new Date()
      });
    }

    // Seed Voter Registrations
    console.log('📝 Seeding voter registrations...');
    for (const registration of completeData.voterRegistrations) {
      await db('voter_registrations').insert({
        user_id: registration.userId,
        constituency_id: registration.constituencyId,
        ward_id: registration.wardId,
        registration_number: registration.registrationNumber,
        verification_status: registration.verificationStatus,
        registration_date: new Date(),
        created_at: new Date()
      });
    }

    // Seed Voter Surveys
    console.log('📋 Seeding voter surveys...');
    for (const survey of completeData.voterSurveys) {
      await db('voter_intent_surveys').insert({
        user_id: survey.userId,
        constituency_id: survey.constituencyId,
        return_intent: survey.returnIntent,
        return_reason: survey.returnReason,
        return_reason_nepali: survey.returnReasonNepali,
        voting_intent: survey.votingIntent,
        preferred_candidate_id: survey.preferredCandidateId,
        concerns: survey.concerns,
        concerns_nepali: survey.concernsNepali,
        suggestions: survey.suggestions,
        suggestions_nepali: survey.suggestionsNepali,
        survey_date: new Date(),
        created_at: new Date()
      });
    }

    console.log('✅ Complete data seeding finished successfully!');
    console.log('📈 Seeded:');
    console.log(`   - ${completeData.provinces.length} provinces`);
    console.log(`   - ${completeData.districts.length} districts`);
    console.log(`   - ${completeData.constituencies.length} constituencies`);
    console.log(`   - ${completeData.politicalParties.length} political parties`);
    console.log(`   - ${completeData.politicians.length} politicians`);
    console.log(`   - ${completeData.electionCandidates.length} election candidates`);
    console.log(`   - ${completeData.polls.length} polls with options`);
    console.log(`   - ${completeData.reports.length} corruption reports`);
    console.log(`   - ${completeData.badges.length} achievement badges`);
    console.log(`   - ${completeData.votingSessions.length} voting sessions`);
    console.log(`   - ${completeData.voterRegistrations.length} voter registrations`);
    console.log(`   - ${completeData.voterSurveys.length} voter surveys`);

  } catch (error) {
    console.error('❌ Error seeding complete data:', error);
    throw error;
  }
}

// Run the seeding
if (require.main === module) {
  seedCompleteData()
    .then(() => {
      console.log('🎉 Complete data seeding process finished!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Complete data seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedCompleteData, completeData };
