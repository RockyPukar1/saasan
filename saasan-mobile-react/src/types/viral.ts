
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
  nameNepali?: string;
  description: string;
  descriptionNepali?: string;
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
  nameNepali?: string;
  location: string;
  locationNepali?: string;
  score: number;
  metric: string;
  change?: "up" | "down" | "same";
  badge?: "champion" | "rising" | "consistent";
}

export interface TrendingPoll {
  id: string;
  title: string;
  titleNepali?: string;
  description: string;
  descriptionNepali?: string;
  category: string;
  categoryNepali?: string;
  total_votes: number;
  trending_score: number;
  options: Array<{
    id: string;
    option: string;
    optionNepali?: string;
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
  titleNepali?: string;
  description: string;
  descriptionNepali?: string;
  location?: string;
  locationNepali?: string;
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
  electionTypeNepali?: string;
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
  nameNepali?: string;
  party: string;
  partyNepali?: string;
  constituency: string;
  constituencyNepali?: string;
  position: string;
  positionNepali?: string;
  manifesto: string[];
  manifestoNepali?: string[];
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
    titleNepali?: string;
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
