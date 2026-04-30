import type {
  PoliticianDto,
  CitizenMessageDto,
  AnnouncementDto,
  ReportDto,
} from "@/types/api";

// Dummy politician data matching backend serializer structure
export const dummyPolitician: PoliticianDto = {
  id: "64f1a2b3c4d5e6f7g8h9i0j1",
  fullName: "Dr. Rajendra Prasad Sharma",
  biography:
    "Dedicated public servant with 15 years of experience in governance and community development. Committed to transparency, accountability, and progressive policies for the betterment of our constituency.",
  contact: {
    email: "rajendra.sharma@parliament.gov.np",
    phone: "+977-1-1234567",
    website: "www.rajendrasharma.com.np",
  },
  socialMedia: {
    facebook: "facebook.com/rajendra.sharma",
    twitter: "twitter.com/RajendraSharmaNP",
    instagram: "instagram.com/rajendra.sharma.np",
  },
  education: "Ph.D. in Public Administration, Tribhuvan University",
  experienceYears: 15,
  isIndependent: false,
  profession: "Politician & Public Administrator",
  rating: 4.2,
  totalReports: 127,
  totalVotes: 45678,
  verifiedReports: 89,
  sourceCategories: {
    party: "Nepali Congress",
    positions: ["Member of Parliament", "House Representative"],
    levels: ["Federal", "Province 3"],
  },
  promises: [
    {
      id: "1",
      title: "Upgrade local health facilities",
      description:
        "Modernize all health posts in the constituency with modern equipment and trained staff",
      status: "in-progress",
      dueDate: new Date("2024-12-31"),
      progress: 65,
    },
    {
      id: "2",
      title: "Construct 50km of rural roads",
      description: "Connect remote villages with all-weather roads",
      status: "in-progress",
      dueDate: new Date("2024-10-30"),
      progress: 40,
    },
    {
      id: "3",
      title: "Digital literacy program",
      description: "Provide computer training to 5000 youths",
      status: "fulfilled",
      dueDate: new Date("2024-03-15"),
      progress: 100,
    },
  ],
  achievements: [
    {
      id: "1",
      title: "Successfully passed Education Reform Bill",
      description:
        "Led the parliamentary committee that passed comprehensive education reform",
      category: "Legislation",
      date: new Date("2023-12-15"),
    },
    {
      id: "2",
      title: "Clean Water Initiative",
      description: "Provided clean drinking water to 10,000 households",
      category: "Infrastructure",
      date: new Date("2023-09-20"),
    },
  ],
  createdAt: "2022-01-15T10:30:00.000Z",
  updatedAt: "2024-03-20T14:45:00.000Z",
};

// Dummy citizen messages
export const dummyCitizenMessages: CitizenMessageDto[] = [
  {
    id: "1",
    citizenId: "64f1a2b3c4d5e6f7g8h9i0j2",
    citizenName: "Sita Kumari",
    citizenEmail: "sita.kumari@email.com",
    subject: "Road repair needed in Ward 5",
    message:
      "The main road in Ward 5 has been damaged for over 3 months. It's affecting daily commute and school transportation. Please take immediate action.",
    category: "complaint",
    urgency: "high",
    status: "pending",
    responseCount: 0,
    createdAt: "2024-03-25T09:15:00.000Z",
    updatedAt: "2024-03-25T09:15:00.000Z",
    jurisdiction: "Ward 5, Kathmandu",
  },
  {
    id: "2",
    citizenId: "64f1a2b3c4d5e6f7g8h9i0j3",
    citizenName: "Ramesh Thapa",
    citizenEmail: "ramesh.thapa@email.com",
    subject: "Request for new school building",
    message:
      "Our local school is overcrowded with 150 students in 3 classrooms. We need a new building to accommodate the growing student population.",
    category: "request",
    urgency: "medium",
    status: "in_progress",
    responseCount: 2,
    lastResponseAt: "2024-03-24T16:30:00.000Z",
    createdAt: "2024-03-20T11:20:00.000Z",
    updatedAt: "2024-03-24T16:30:00.000Z",
    jurisdiction: "Ward 3, Kathmandu",
  },
  {
    id: "3",
    citizenId: "64f1a2b3c4d5e6f7g8h9i0j4",
    citizenName: "Gopal Bahadur",
    citizenEmail: "gopal.bahadur@email.com",
    subject: "Suggestion for waste management",
    message:
      "I suggest implementing a door-to-door waste collection system with proper segregation. This has worked well in neighboring municipalities.",
    category: "suggestion",
    urgency: "low",
    status: "resolved",
    responseCount: 3,
    lastResponseAt: "2024-03-22T10:15:00.000Z",
    createdAt: "2024-03-18T14:45:00.000Z",
    updatedAt: "2024-03-22T10:15:00.000Z",
    jurisdiction: "Ward 7, Kathmandu",
  },
];

// Dummy announcements
export const dummyAnnouncements: AnnouncementDto[] = [
  {
    id: "1",
    title: "Constituency Meeting - Development Plans",
    content:
      "I will be holding a public meeting to discuss upcoming development projects for our constituency. All citizens are welcome to share their suggestions and concerns.",
    type: "meeting",
    priority: "high",
    isPublic: true,
    politicianId: "64f1a2b3c4d5e6f7g8h9i0j1",
    scheduledAt: "2024-04-05T14:00:00.000Z",
    publishedAt: "2024-03-25T10:00:00.000Z",
    createdBy: "64f1a2b3c4d5e6f7g8h9i0j1",
    createdAt: "2024-03-25T09:30:00.000Z",
    updatedAt: "2024-03-25T10:00:00.000Z",
  },
  {
    id: "2",
    title: "Progress Update: Road Construction Project",
    content:
      "The road construction project connecting Ward 3 to Ward 7 is 60% complete. Expected completion by end of next month. Thank you for your patience.",
    type: "update",
    priority: "medium",
    isPublic: true,
    politicianId: "64f1a2b3c4d5e6f7g8h9i0j1",
    publishedAt: "2024-03-24T16:00:00.000Z",
    createdBy: "64f1a2b3c4d5e6f7g8h9i0j1",
    createdAt: "2024-03-24T15:30:00.000Z",
    updatedAt: "2024-03-24T16:00:00.000Z",
  },
  {
    id: "3",
    title: "New Health Post Inauguration",
    content:
      "Proud to announce the inauguration of the new health post in Ward 5. This facility will serve over 5,000 residents with modern medical equipment and trained staff.",
    type: "achievement",
    priority: "medium",
    isPublic: true,
    politicianId: "64f1a2b3c4d5e6f7g8h9i0j1",
    publishedAt: "2024-03-20T11:00:00.000Z",
    createdBy: "64f1a2b3c4d5e6f7g8h9i0j1",
    createdAt: "2024-03-20T10:30:00.000Z",
    updatedAt: "2024-03-20T11:00:00.000Z",
  },
];

// Dummy reports related to constituency
export const dummyReports: ReportDto[] = [
  {
    id: "1",
    title: "Corruption in road construction contract",
    description:
      "Evidence of irregularities in the awarding of road construction contracts in Ward 3",
    statusId: "1",
    priorityId: "1",
    visibilityId: "1",
    typeId: "1",
    upvotesCount: 45,
    downvotesCount: 3,
    viewsCount: 1250,
    referenceNumber: "20240325001",
    tags: ["corruption", "infrastructure", "ward-3"],
    isAnonymous: false,
    createdAt: "2024-03-25T08:30:00.000Z",
    updatedAt: "2024-03-25T14:20:00.000Z",
    evidences: [
      {
        id: "1",
        originalName: "contract_document.pdf",
        filePath: "https://res.cloudinary.com/saasan/documents/contract.pdf",
        fileType: "pdf",
        uploadedAt: "2024-03-25T09:00:00.000Z",
        cloudinaryPublicId: "saasan/contracts/abc123",
      },
    ],
    activities: [],
    sharesCount: 23,
    sourceCategories: {
      type: "Infrastructure",
      priority: "High",
      visibility: "Public",
      status: "Under Investigation",
    },
  },
  {
    id: "2",
    title: "Water supply contamination issue",
    description: "Contaminated water supply affecting 200 households in Ward 7",
    statusId: "2",
    priorityId: "2",
    visibilityId: "1",
    typeId: "2",
    upvotesCount: 67,
    downvotesCount: 1,
    viewsCount: 890,
    referenceNumber: "20240324002",
    tags: ["water", "health", "ward-7"],
    isAnonymous: true,
    createdAt: "2024-03-24T11:15:00.000Z",
    updatedAt: "2024-03-24T18:30:00.000Z",
    evidences: [],
    activities: [],
    sharesCount: 15,
    sourceCategories: {
      type: "Health",
      priority: "Medium",
      visibility: "Public",
      status: "Resolved",
    },
  },
];
