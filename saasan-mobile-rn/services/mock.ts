const mockDashboardStats = {
  success: true,
  data: {
    overview: {
      totalReports: 128,
      resolvedReports: 74,
      resolutionRate: 58,
      activePoliticians: 12,
      totalPoliticians: 20,
    },
    categoryBreakdown: [
      { categoryName: "Corruption", count: 35 },
      { categoryName: "Financial", count: 20 },
      { categoryName: "Abuse of Power", count: 15 },
      { categoryName: "Infrastructure", count: 25 },
      { categoryName: "Healthcare", count: 12 },
      { categoryName: "Education", count: 14 },
      { categoryName: "Environment", count: 7 },
    ],
  },
};

const mockMajorCases = {
  success: true,
  data: [
    {
      id: "case-101",
      title: "Highway Corruption Scandal",
      description:
        "Funds allocated for highway construction were allegedly misused by contractors and local officials.",
      amountInvolved: 50000000,
      status: "ongoing",
      createdAt: "2024-07-15T10:30:00.000Z",
      upvotesCount: 325,
      referenceNumber: "HC-2024-001",
      priority: "urgent",
    },
    {
      id: "case-102",
      title: "Hospital Equipment Fraud",
      description:
        "Medical equipment procurement was overpriced by 200%, causing shortage in rural hospitals.",
      amountInvolved: 15000000,
      status: "submitted",
      createdAt: "2024-08-01T09:00:00.000Z",
      upvotesCount: 212,
      referenceNumber: "HF-2024-013",
      priority: "high",
    },
    {
      id: "case-103",
      title: "Education Grant Misuse",
      description:
        "Funds meant for underprivileged schools were redirected to private institutions.",
      amountInvolved: 8000000,
      status: "resolved",
      createdAt: "2024-06-20T12:00:00.000Z",
      upvotesCount: 97,
      referenceNumber: "EG-2024-009",
      priority: "medium",
    },
  ],
};

const mockLiveServices = {
  success: true,
  data: [
    { id: "srv-201", serviceType: "electricity", status: "online" },
    { id: "srv-202", serviceType: "electricity", status: "online" },
    { id: "srv-203", serviceType: "electricity", status: "offline" },
    { id: "srv-204", serviceType: "electricity", status: "online" },
    { id: "srv-205", serviceType: "water", status: "online" },
    { id: "srv-206", serviceType: "internet", status: "offline" },
  ],
};

export const apiService = {
  getDashboardStats: async () => {
    await new Promise((res) => setTimeout(res, 500)); // simulate network delay
    return mockDashboardStats;
  },
  getMajorCases: async () => {
    await new Promise((res) => setTimeout(res, 500));
    return mockMajorCases;
  },
  getLiveServices: async () => {
    await new Promise((res) => setTimeout(res, 500));
    return mockLiveServices;
  },
};
