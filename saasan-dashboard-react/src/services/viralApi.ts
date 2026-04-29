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

const viralBackendUnavailable = () =>
  new Error("Viral backend routes are not implemented yet.");

// Viral API functions for dashboard
export const viralApi = {
  // Analytics and metrics
  getViralMetrics: async (): Promise<ViralMetrics> => {
    try {
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching viral metrics:", error);
      return {
        totalShares: 0,
        totalVotes: 0,
        totalComments: 0,
        activeUsers: 0,
        viralScore: 0,
        topSharedContent: [],
        trendingHashtags: [],
        viralTrends: [],
      };
    }
  },

  // Leaderboards
  getLeaderboard: async (
    type: "reports" | "participation" | "corruption_fighters",
    period: "week" | "month" | "all_time"
  ): Promise<LeaderboardEntry[]> => {
    try {
      void type;
      void period;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  },

  // Trending polls
  getTrendingPolls: async (limit: number = 10): Promise<TrendingPoll[]> => {
    try {
      void limit;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching trending polls:", error);
      return [];
    }
  },

  // Transparency feed
  getTransparencyFeed: async (
    limit: number = 20,
    offset: number = 0
  ): Promise<FeedItem[]> => {
    try {
      void limit;
      void offset;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching transparency feed:", error);
      return [];
    }
  },

  // Badges management
  getAllBadges: async (): Promise<Badge[]> => {
    try {
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching badges:", error);
      return [];
    }
  },

  createBadge: async (badgeData: {
    name: string;
    description: string;
    category: string;
    rarity: string;
    maxProgress: number;
  }): Promise<Badge> => {
    try {
      void badgeData;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error creating badge:", error);
      throw error;
    }
  },

  updateBadge: async (
    badgeId: string,
    badgeData: Partial<Badge>
  ): Promise<Badge> => {
    try {
      void badgeId;
      void badgeData;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error updating badge:", error);
      throw error;
    }
  },

  deleteBadge: async (badgeId: string): Promise<void> => {
    try {
      void badgeId;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error deleting badge:", error);
      throw error;
    }
  },

  // User badges management
  getUserBadges: async (userId?: string): Promise<Badge[]> => {
    try {
      void userId;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching user badges:", error);
      return [];
    }
  },

  // Comments management
  getComments: async (
    itemId?: string,
    itemType?: string
  ): Promise<Comment[]> => {
    try {
      void itemId;
      void itemType;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  },

  deleteComment: async (commentId: string): Promise<void> => {
    try {
      void commentId;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  },

  moderateComment: async (
    commentId: string,
    action: "approve" | "reject" | "hide"
  ): Promise<void> => {
    try {
      void commentId;
      void action;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error moderating comment:", error);
      throw error;
    }
  },

  // Verification management
  getVerificationQueue: async (): Promise<
    Array<{
      id: string;
      itemId: string;
      itemType: string;
      title: string;
      status: string;
      submittedAt: string;
      priority: string;
    }>
  > => {
    try {
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching verification queue:", error);
      return [];
    }
  },

  updateVerificationStatus: async (
    itemId: string,
    itemType: string,
    status: string,
    notes?: string
  ): Promise<void> => {
    try {
      void itemId;
      void itemType;
      void status;
      void notes;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error updating verification status:", error);
      throw error;
    }
  },

  // Election management
  getElectionData: async (): Promise<ElectionData> => {
    try {
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching election data:", error);
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
    }
  },

  updateElectionData: async (
    electionData: Partial<ElectionData>
  ): Promise<ElectionData> => {
    try {
      void electionData;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error updating election data:", error);
      throw error;
    }
  },

  // Candidates management
  getCandidates: async (constituency?: string): Promise<Candidate[]> => {
    try {
      void constituency;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching candidates:", error);
      return [];
    }
  },

  createCandidate: async (
    candidateData: Partial<Candidate>
  ): Promise<Candidate> => {
    try {
      void candidateData;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error creating candidate:", error);
      throw error;
    }
  },

  updateCandidate: async (
    candidateId: string,
    candidateData: Partial<Candidate>
  ): Promise<Candidate> => {
    try {
      void candidateId;
      void candidateData;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error updating candidate:", error);
      throw error;
    }
  },

  deleteCandidate: async (candidateId: string): Promise<void> => {
    try {
      void candidateId;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      throw error;
    }
  },

  // Viral content management
  getTopSharedContent: async (
    limit: number = 20
  ): Promise<
    Array<{
      id: string;
      title: string;
      type: string;
      shareCount: number;
      viralScore: number;
      createdAt: string;
    }>
  > => {
    try {
      void limit;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching top shared content:", error);
      return [];
    }
  },

  getViralTrends: async (
    days: number = 30
  ): Promise<
    Array<{
      date: string;
      shares: number;
      votes: number;
      comments: number;
      viralScore: number;
    }>
  > => {
    try {
      void days;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching viral trends:", error);
      return [];
    }
  },

  // System settings
  updateViralSettings: async (settings: {
    viralThreshold: number;
    trendingAlgorithm: string;
    badgePoints: Record<string, number>;
    shareRewards: Record<string, number>;
  }): Promise<void> => {
    try {
      void settings;
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error updating viral settings:", error);
      throw error;
    }
  },

  getViralSettings: async (): Promise<any> => {
    try {
      throw viralBackendUnavailable();
    } catch (error) {
      console.error("Error fetching viral settings:", error);
      return {};
    }
  },
};
