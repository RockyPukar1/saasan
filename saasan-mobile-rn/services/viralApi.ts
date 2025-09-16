// Types for viral features
export interface ShareData {
  id: string;
  type: "corruption_report" | "poll_result" | "politician_rating";
  title: string;
  description?: string;
  location?: string;
  amountInvolved?: number;
  total_votes?: number;
  options?: Array<{
    id: string;
    option: string;
    votes: number;
    percentage: number;
  }>;
  name?: string;
  position?: string;
  constituency?: string;
  rating?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: "reporter" | "voter" | "community" | "special";
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  location: string;
  score: number;
  metric: string;
  change?: "up" | "down" | "same";
  badge?: "champion" | "rising" | "consistent";
}

export interface TrendingPoll {
  id: string;
  title: string;
  description: string;
  category: string;
  total_votes: number;
  trending_score: number;
  options: Array<{
    id: string;
    option: string;
    votes: number;
    percentage: number;
  }>;
  created_at: string;
  viral_potential: "low" | "medium" | "high" | "explosive";
  share_count: number;
  hashtags: string[];
}

export interface FeedItem {
  id: string;
  type:
    | "corruption_report"
    | "poll_result"
    | "politician_update"
    | "system_alert";
  title: string;
  description: string;
  location?: string;
  amount?: number;
  timestamp: string;
  viral_score: number;
  share_count: number;
  reaction_count: number;
  is_verified: boolean;
  priority: "low" | "medium" | "high" | "critical";
  tags: string[];
  viral_message?: string;
}

export interface StreakData {
  dailyStreak: number;
  weeklyStreak: number;
  monthlyStreak: number;
  longestDailyStreak: number;
  longestWeeklyStreak: number;
  totalDaysActive: number;
  lastActivityDate: string;
  streakHistory: Array<{
    date: string;
    activities: string[];
    points: number;
  }>;
}

export interface Comment {
  id: string;
  author: string;
  authorId: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: Comment[];
  isVerified: boolean;
  isAuthor: boolean;
  isLiked?: boolean;
  isDisliked?: boolean;
}

export interface VerificationStatus {
  status:
    | "verified"
    | "under_review"
    | "pending"
    | "rejected"
    | "citizen_report";
  level: "high" | "medium" | "low";
  verifiedBy: string;
  verifiedAt: string;
  evidenceCount: number;
  communityVotes: {
    upvotes: number;
    downvotes: number;
    totalVoters: number;
  };
  credibilityScore: number;
  verificationNotes?: string;
}

export interface ElectionData {
  electionDate: string;
  electionType: string;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  totalCandidates: number;
  totalConstituencies: number;
  registeredVoters: number;
  isActive: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  constituency: string;
  position: string;
  manifesto: string[];
  rating: number;
  promises: number;
  achievements: number;
  controversies: number;
  isIncumbent: boolean;
  imageUrl?: string;
}

export interface ViralMetrics {
  totalShares: number;
  totalVotes: number;
  totalComments: number;
  activeUsers: number;
  viralScore: number;
  topSharedContent: Array<{
    id: string;
    title: string;
    type: string;
    shareCount: number;
  }>;
  trendingHashtags: Array<{
    tag: string;
    count: number;
  }>;
  viralTrends: Array<{
    date: string;
    shares: number;
    votes: number;
    comments: number;
  }>;
}

// Viral API functions for mobile app - Mock implementation
export const viralApi = {
  // Share functionality
  generateShareContent: async (
    data: ShareData
  ): Promise<{ viralText: string; shareText: string }> => {
    // Mock implementation
    return {
      viralText: `🚨 ${data.title} — Reported on Saasan 🔥`,
      shareText: `Check out this ${data.type} on Saasan App\n#FightCorruption #SaasanApp #Nepal`,
    };
  },

  trackShare: async (
    itemId: string,
    itemType: string,
    platform: string
  ): Promise<void> => {
    // Mock implementation - just log
    console.log(`Tracked share: ${itemId} (${itemType}) on ${platform}`);
  },

  // Badges and achievements
  getUserBadges: async (userId?: string): Promise<Badge[]> => {
    // Mock implementation
    return [
      {
        id: "first_report",
        name: "Whistleblower",
        description: "Submitted your first corruption report",
        category: "reporter",
        unlocked: true,
        rarity: "common",
        unlockedAt: new Date().toISOString(),
      },
      {
        id: "veteran_reporter",
        name: "Veteran Reporter",
        description: "Submitted 10+ corruption reports",
        category: "reporter",
        unlocked: false,
        progress: 3,
        maxProgress: 10,
        rarity: "rare",
      },
    ];
  },

  unlockBadge: async (badgeId: string): Promise<Badge> => {
    // Mock implementation
    return {
      id: badgeId,
      name: "Unlocked Badge",
      description: "You unlocked a badge!",
      category: "special",
      unlocked: true,
      rarity: "common",
      unlockedAt: new Date().toISOString(),
    };
  },

  // Leaderboards
  getLeaderboard: async (
    type: "reports" | "participation" | "corruption_fighters",
    period: "week" | "month" | "all_time"
  ): Promise<LeaderboardEntry[]> => {
    // Mock implementation
    return [
      {
        rank: 1,
        name: "Kathmandu District",
        location: "Kathmandu",
        score: 1250,
        metric: "reports",
        change: "up",
        badge: "champion",
      },
      {
        rank: 2,
        name: "Lalitpur District",
        location: "Lalitpur",
        score: 980,
        metric: "reports",
        change: "up",
        badge: "rising",
      },
    ];
  },

  // Trending polls
  getTrendingPolls: async (limit: number = 10): Promise<TrendingPoll[]> => {
    // Mock implementation
    return [
      {
        id: "1",
        title: "Should corruption cases be public?",
        description: "A poll about transparency in corruption cases",
        category: "governance",
        total_votes: 1250,
        trending_score: 85,
        options: [
          { id: "1", option: "Yes, always", votes: 800, percentage: 64 },
          { id: "2", option: "No, private", votes: 450, percentage: 36 },
        ],
        created_at: new Date().toISOString(),
        viral_potential: "high",
        share_count: 245,
        hashtags: ["transparency", "governance"],
      },
    ];
  },

  voteOnPoll: async (
    pollId: string,
    optionId: string
  ): Promise<{ success: boolean; message: string }> => {
    // Mock implementation
    return {
      success: true,
      message: "Vote recorded successfully",
    };
  },

  // Transparency feed
  getTransparencyFeed: async (
    limit: number = 20,
    offset: number = 0
  ): Promise<FeedItem[]> => {
    // Mock implementation
    return [
      {
        id: "1",
        type: "corruption_report",
        title: "Road construction corruption exposed",
        description: "Evidence of misused funds in road construction project",
        location: "Kathmandu",
        amount: 5000000,
        timestamp: new Date().toISOString(),
        viral_score: 85,
        share_count: 150,
        reaction_count: 89,
        is_verified: true,
        priority: "high",
        tags: ["construction", "corruption"],
        viral_message: "💸 5M NPR MISUSED in Kathmandu — Reported on Saasan 🔥",
      },
    ];
  },

  reactToFeedItem: async (
    itemId: string,
    reaction: "like" | "dislike"
  ): Promise<void> => {
    // Mock implementation
    console.log(`Reacted to ${itemId} with ${reaction}`);
  },

  // Streaks
  getUserStreaks: async (userId?: string): Promise<StreakData> => {
    // Mock implementation
    return {
      dailyStreak: 5,
      weeklyStreak: 2,
      monthlyStreak: 1,
      longestDailyStreak: 15,
      longestWeeklyStreak: 4,
      totalDaysActive: 45,
      lastActivityDate: new Date().toISOString(),
      streakHistory: [
        {
          date: new Date().toISOString().split("T")[0],
          activities: ["report_submitted", "poll_voted"],
          points: 15,
        },
      ],
    };
  },

  recordActivity: async (activity: string, points: number): Promise<void> => {
    // Mock implementation
    console.log(`Recorded activity: ${activity} (+${points} points)`);
  },

  // Comments
  getComments: async (itemId: string, itemType: string): Promise<Comment[]> => {
    // Mock implementation
    return [
      {
        id: "1",
        author: "Citizen Reporter",
        authorId: "user123",
        content: "This is concerning. We need more transparency.",
        timestamp: new Date().toISOString(),
        likes: 12,
        dislikes: 2,
        replies: [],
        isVerified: false,
        isAuthor: false,
      },
    ];
  },

  postComment: async (
    itemId: string,
    itemType: string,
    content: string
  ): Promise<Comment> => {
    // Mock implementation
    return {
      id: "new_comment",
      author: "You",
      authorId: "current_user",
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isVerified: false,
      isAuthor: true,
    };
  },

  replyToComment: async (
    commentId: string,
    content: string
  ): Promise<Comment> => {
    // Mock implementation
    return {
      id: "reply_comment",
      author: "You",
      authorId: "current_user",
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      dislikes: 0,
      replies: [],
      isVerified: false,
      isAuthor: true,
    };
  },

  voteOnComment: async (
    commentId: string,
    vote: "up" | "down"
  ): Promise<void> => {
    // Mock implementation
    console.log(`Voted ${vote} on comment ${commentId}`);
  },

  reportComment: async (commentId: string, reason: string): Promise<void> => {
    // Mock implementation
    console.log(`Reported comment ${commentId}: ${reason}`);
  },

  // Verification
  getVerificationStatus: async (
    itemId: string,
    itemType: string
  ): Promise<VerificationStatus> => {
    // Mock implementation
    return {
      status: "citizen_report",
      level: "low",
      verifiedBy: "Community",
      verifiedAt: new Date().toISOString(),
      evidenceCount: 0,
      communityVotes: {
        upvotes: 0,
        downvotes: 0,
        totalVoters: 0,
      },
      credibilityScore: 0,
    };
  },

  voteOnVerification: async (
    itemId: string,
    itemType: string,
    vote: "up" | "down"
  ): Promise<void> => {
    // Mock implementation
    console.log(`Voted ${vote} on verification for ${itemId}`);
  },

  // Invite challenges
  getInviteStats: async (
    userId?: string
  ): Promise<{
    friendsInvited: number;
    friendsJoined: number;
    totalRewards: number;
    milestones: Array<{
      id: string;
      title: string;
      description: string;
      target: number;
      current: number;
      reward: string;
      completed: boolean;
    }>;
  }> => {
    // Mock implementation
    return {
      friendsInvited: 5,
      friendsJoined: 2,
      totalRewards: 150,
      milestones: [
        {
          id: "invite_5",
          title: "Social Butterfly",
          description: "Invite 5 friends",
          target: 5,
          current: 5,
          reward: "100 points",
          completed: true,
        },
      ],
    };
  },

  trackInvite: async (inviteCode: string, platform: string): Promise<void> => {
    // Mock implementation
    console.log(`Tracked invite ${inviteCode} on ${platform}`);
  },

  // Election mode
  getElectionData: async (): Promise<ElectionData> => {
    // Mock implementation
    return {
      electionDate: "2024-04-10T08:00:00Z",
      electionType: "Federal Election",
      daysRemaining: 85,
      hoursRemaining: 12,
      minutesRemaining: 30,
      totalCandidates: 1250,
      totalConstituencies: 165,
      registeredVoters: 18000000,
      isActive: true,
    };
  },

  getCandidates: async (constituency?: string): Promise<Candidate[]> => {
    // Mock implementation
    return [
      {
        id: "1",
        name: "John Doe",
        party: "Democratic Party",
        constituency: "Kathmandu-1",
        position: "Member of Parliament",
        manifesto: ["Transparency", "Development"],
        rating: 4.2,
        promises: 15,
        achievements: 8,
        controversies: 2,
        isIncumbent: true,
      },
    ];
  },

  compareCandidates: async (
    candidateIds: string[]
  ): Promise<{
    comparison: any;
    recommendations: string[];
  }> => {
    // Mock implementation
    return {
      comparison: {},
      recommendations: ["Compare their track records", "Check their manifesto"],
    };
  },

  // Analytics and metrics
  getViralMetrics: async (): Promise<ViralMetrics> => {
    // Mock implementation
    return {
      totalShares: 1250,
      totalVotes: 3400,
      totalComments: 890,
      activeUsers: 450,
      viralScore: 75,
      topSharedContent: [
        {
          id: "1",
          title: "Major corruption case exposed",
          type: "corruption_report",
          shareCount: 245,
        },
      ],
      trendingHashtags: [
        { tag: "FightCorruption", count: 1250 },
        { tag: "Transparency", count: 890 },
      ],
      viralTrends: [
        {
          date: new Date().toISOString().split("T")[0],
          shares: 125,
          votes: 340,
          comments: 89,
        },
      ],
    };
  },

  // Real-time updates
  subscribeToUpdates: (callback: (update: any) => void): (() => void) => {
    // Mock implementation - just return a cleanup function
    console.log("Subscribed to viral updates");
    return () => {
      console.log("Unsubscribed from viral updates");
    };
  },
};
