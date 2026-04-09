import type { JurisdictionHierarchy, MessageThread, JurisdictionAnnouncement, JurisdictionReport, LocationDto } from "@/types/jurisdiction";

// Sample politician jurisdiction (Member of Parliament for Constituency 1)
export const politicianJurisdiction: JurisdictionHierarchy = {
  provinceId: "province-1", // Province 3 (Bagmati)
  districtId: "district-1", // Kathmandu District
  constituencyId: "constituency-1", // Kathmandu Constituency 1
  // municipalityId and wardId are not applicable for MP level
};

// Sample locations within the jurisdiction
export const accessibleLocations: LocationDto[] = [
  {
    _id: "province-1",
    name: "Bagmati Province",
    type: "province",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z"
  },
  {
    _id: "district-1",
    name: "Kathmandu District",
    type: "district",
    provinceId: "province-1",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z"
  },
  {
    _id: "constituency-1",
    name: "Kathmandu Constituency 1",
    type: "constituency",
    provinceId: "province-1",
    districtId: "district-1",
    constituencyNumber: 1,
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z"
  },
  {
    _id: "municipality-1",
    name: "Kathmandu Metropolitan City",
    type: "municipality",
    provinceId: "province-1",
    districtId: "district-1",
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z"
  },
  {
    _id: "ward-1",
    name: "Ward 1, Kathmandu",
    type: "ward",
    provinceId: "province-1",
    districtId: "district-1",
    municipalityId: "municipality-1",
    wardNumber: 1,
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z"
  },
  {
    _id: "ward-2",
    name: "Ward 2, Kathmandu",
    type: "ward",
    provinceId: "province-1",
    districtId: "district-1",
    municipalityId: "municipality-1",
    wardNumber: 2,
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z"
  },
  {
    _id: "ward-3",
    name: "Ward 3, Kathmandu",
    type: "ward",
    provinceId: "province-1",
    districtId: "district-1",
    municipalityId: "municipality-1",
    wardNumber: 3,
    createdAt: "2022-01-01T00:00:00.000Z",
    updatedAt: "2022-01-01T00:00:00.000Z"
  }
];

// Threaded citizen messages within jurisdiction
export const jurisdictionMessageThreads: MessageThread[] = [
  {
    id: "thread-1",
    subject: "Road repair needed in Ward 1",
    category: "complaint",
    urgency: "high",
    status: "in_progress",
    jurisdiction: {
      provinceId: "province-1",
      districtId: "district-1",
      constituencyId: "constituency-1",
      municipalityId: "municipality-1",
      wardId: "ward-1"
    },
    participants: {
      citizen: {
        id: "citizen-1",
        name: "Sita Kumari",
        email: "sita.kumari@email.com",
        location: {
          provinceId: "province-1",
          districtId: "district-1",
          constituencyId: "constituency-1",
          municipalityId: "municipality-1",
          wardId: "ward-1"
        }
      },
      politician: {
        id: "politician-1",
        name: "Dr. Rajendra Prasad Sharma"
      }
    },
    messages: [
      {
        id: "msg-1",
        senderId: "citizen-1",
        senderType: "citizen",
        content: "The main road in Ward 1 has been damaged for over 3 months. It's affecting daily commute and school transportation. Please take immediate action.",
        createdAt: "2024-03-25T09:15:00.000Z",
        readAt: "2024-03-25T14:30:00.000Z"
      },
      {
        id: "msg-2",
        senderId: "politician-1",
        senderType: "politician",
        content: "Thank you for bringing this to my attention. I have contacted the municipal authorities and they have assured me that repair work will begin next week. I will personally monitor the progress.",
        createdAt: "2024-03-25T14:30:00.000Z",
        readAt: "2024-03-25T16:45:00.000Z"
      },
      {
        id: "msg-3",
        senderId: "citizen-1",
        senderType: "citizen",
        content: "Thank you for your prompt response. We appreciate your attention to this matter. Please keep us updated on the progress.",
        createdAt: "2024-03-25T16:45:00.000Z"
      }
    ],
    lastMessageAt: "2024-03-25T16:45:00.000Z",
    createdAt: "2024-03-25T09:15:00.000Z",
    updatedAt: "2024-03-25T16:45:00.000Z"
  },
  {
    id: "thread-2",
    subject: "Request for new school building in Ward 3",
    category: "request",
    urgency: "medium",
    status: "pending",
    jurisdiction: {
      provinceId: "province-1",
      districtId: "district-1",
      constituencyId: "constituency-1",
      municipalityId: "municipality-1",
      wardId: "ward-3"
    },
    participants: {
      citizen: {
        id: "citizen-2",
        name: "Ramesh Thapa",
        email: "ramesh.thapa@email.com",
        location: {
          provinceId: "province-1",
          districtId: "district-1",
          constituencyId: "constituency-1",
          municipalityId: "municipality-1",
          wardId: "ward-3"
        }
      },
      politician: {
        id: "politician-1",
        name: "Dr. Rajendra Prasad Sharma"
      }
    },
    messages: [
      {
        id: "msg-4",
        senderId: "citizen-2",
        senderType: "citizen",
        content: "Our local school is overcrowded with 150 students in 3 classrooms. We need a new building to accommodate the growing student population in Ward 3.",
        createdAt: "2024-03-24T11:20:00.000Z",
        readAt: "2024-03-24T15:30:00.000Z"
      },
      {
        id: "msg-5",
        senderId: "politician-1",
        senderType: "politician",
        content: "I understand the urgency of this situation. Let me schedule a site visit next week to assess the current infrastructure and discuss options with the education authorities.",
        createdAt: "2024-03-24T15:30:00.000Z"
      }
    ],
    lastMessageAt: "2024-03-24T15:30:00.000Z",
    createdAt: "2024-03-24T11:20:00.000Z",
    updatedAt: "2024-03-24T15:30:00.000Z"
  }
];

// Jurisdiction-based announcements
export const jurisdictionAnnouncements: JurisdictionAnnouncement[] = [
  {
    id: "announce-1",
    title: "Constituency Meeting - Development Plans",
    content: "I will be holding a public meeting to discuss upcoming development projects for our constituency. All citizens from Wards 1-5 are welcome to share their suggestions and concerns.",
    type: "meeting",
    priority: "high",
    targetJurisdiction: {
      provinceId: "province-1",
      districtId: "district-1",
      constituencyId: "constituency-1"
    },
    isPublic: true,
    scheduledAt: "2024-04-05T14:00:00.000Z",
    publishedAt: "2024-03-25T10:00:00.000Z",
    createdBy: "politician-1",
    createdAt: "2024-03-25T09:30:00.000Z",
    updatedAt: "2024-03-25T10:00:00.000Z",
    visibility: {
      constituencies: ["constituency-1"],
      municipalities: ["municipality-1"],
      wards: ["ward-1", "ward-2", "ward-3", "ward-4", "ward-5"]
    }
  },
  {
    id: "announce-2",
    title: "Progress Update: Ward 1 Road Construction",
    content: "The road construction project in Ward 1 is 60% complete. Expected completion by end of next month. Thank you for your patience and support.",
    type: "update",
    priority: "medium",
    targetJurisdiction: {
      provinceId: "province-1",
      districtId: "district-1",
      constituencyId: "constituency-1",
      municipalityId: "municipality-1",
      wardId: "ward-1"
    },
    isPublic: true,
    publishedAt: "2024-03-24T16:00:00.000Z",
    createdBy: "politician-1",
    createdAt: "2024-03-24T15:30:00.000Z",
    updatedAt: "2024-03-24T16:00:00.000Z",
    visibility: {
      wards: ["ward-1"]
    }
  },
  {
    id: "announce-3",
    title: "New Health Post Inauguration - Ward 3",
    content: "Proud to announce the inauguration of the new health post in Ward 3. This facility will serve over 5,000 residents with modern medical equipment and trained staff.",
    type: "achievement",
    priority: "medium",
    targetJurisdiction: {
      provinceId: "province-1",
      districtId: "district-1",
      constituencyId: "constituency-1",
      municipalityId: "municipality-1",
      wardId: "ward-3"
    },
    isPublic: true,
    publishedAt: "2024-03-20T11:00:00.000Z",
    createdBy: "politician-1",
    createdAt: "2024-03-20T10:30:00.000Z",
    updatedAt: "2024-03-20T11:00:00.000Z",
    visibility: {
      wards: ["ward-3"]
    }
  }
];

// Jurisdiction-based reports
export const jurisdictionReports: JurisdictionReport[] = [
  {
    id: "report-1",
    title: "Corruption in Ward 1 road construction contract",
    description: "Evidence of irregularities in the awarding of road construction contracts in Ward 1",
    jurisdiction: {
      provinceId: "province-1",
      districtId: "district-1",
      constituencyId: "constituency-1",
      municipalityId: "municipality-1",
      wardId: "ward-1"
    },
    reporterId: "citizen-3",
    reporterLocation: {
      provinceId: "province-1",
      districtId: "district-1",
      constituencyId: "constituency-1",
      municipalityId: "municipality-1",
      wardId: "ward-1"
    },
    typeId: "type-1",
    priorityId: "priority-1",
    statusId: "status-1",
    visibilityId: "visibility-1",
    referenceNumber: "20240325001",
    tags: ["corruption", "infrastructure", "ward-1"],
    isAnonymous: false,
    createdAt: "2024-03-25T08:30:00.000Z",
    updatedAt: "2024-03-25T14:20:00.000Z"
  },
  {
    id: "report-2",
    title: "Water supply contamination in Ward 2",
    description: "Contaminated water supply affecting 200 households in Ward 2",
    jurisdiction: {
      provinceId: "province-1",
      districtId: "district-1",
      constituencyId: "constituency-1",
      municipalityId: "municipality-1",
      wardId: "ward-2"
    },
    reporterId: "citizen-4",
    reporterLocation: {
      provinceId: "province-1",
      districtId: "district-1",
      constituencyId: "constituency-1",
      municipalityId: "municipality-1",
      wardId: "ward-2"
    },
    typeId: "type-2",
    priorityId: "priority-2",
    statusId: "status-2",
    visibilityId: "visibility-1",
    referenceNumber: "20240324002",
    tags: ["water", "health", "ward-2"],
    isAnonymous: true,
    createdAt: "2024-03-24T11:15:00.000Z",
    updatedAt: "2024-03-24T18:30:00.000Z"
  }
];
