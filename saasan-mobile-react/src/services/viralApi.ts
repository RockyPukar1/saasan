import { apiService } from "./api";
import { formatApiResponse } from "../lib/bilingual";
import type { Badge, Candidate, ElectionData, FeedItem, LeaderboardEntry, StreakData, TrendingPoll, VerificationStatus, ViralMetrics, ShareData } from "@/types/viral";

// Viral API functions for mobile app - Real API integration
export const viralApi = {
  // Share functionality
  generateShareContent: async (
    data: ShareData
  ): Promise<{ viralText: string; shareText: string }> => {
    try {
      const response = await apiService.generateShareContent(data, "user-id"); // TODO: Get actual user ID
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error generating share content:", error);
      throw error;
    }
  },

  trackShare: async (
    itemId: string,
    itemType: string,
    platform: string
  ): Promise<void> => {
    try {
      await apiService.trackShare(itemId, itemType, platform, "user-id"); // TODO: Get actual user ID
    } catch (error) {
      console.error("Error tracking share:", error);
      throw error;
    }
  },

  // Badges and achievements
  getUserBadges: async (userId?: string): Promise<Badge[]> => {
    try {
      const response = await apiService.getBadges({ userId });
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error getting user badges:", error);
      throw error;
    }
  },

  unlockBadge: async (badgeId: string): Promise<Badge> => {
    try {
      const response = await apiService.unlockBadge(badgeId);
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error unlocking badge:", error);
      throw error;
    }
  },

  // Leaderboards
  getLeaderboard: async (
    type: "reports" | "participation" | "corruption_fighters",
    period: "week" | "month" | "all_time"
  ): Promise<LeaderboardEntry[]> => {
    try {
      const response = await apiService.getLeaderboard(type, period);
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      throw error;
    }
  },

  // Trending polls
  getTrendingPolls: async (limit: number = 10): Promise<TrendingPoll[]> => {
    try {
      const response = await apiService.getTrendingPolls(limit);
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error getting trending polls:", error);
      throw error;
    }
  },

  voteOnPoll: async (
    pollId: string,
    optionId: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiService.voteOnPollViral(
        pollId,
        optionId,
        "user-id"
      ); // TODO: Get actual user ID
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error voting on poll:", error);
      throw error;
    }
  },

  // Transparency feed
  getTransparencyFeed: async (
    limit: number = 20,
    offset: number = 0
  ): Promise<FeedItem[]> => {
    try {
      const response = await apiService.getTransparencyFeed(limit, offset);
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error getting transparency feed:", error);
      throw error;
    }
  },

  reactToFeedItem: async (
    itemId: string,
    reaction: "like" | "dislike"
  ): Promise<void> => {
    try {
      await apiService.reactToFeed(itemId, "feed", reaction, "user-id"); // TODO: Get actual user ID
    } catch (error) {
      console.error("Error reacting to feed item:", error);
      throw error;
    }
  },

  // Streaks
  getUserStreaks: async (userId?: string): Promise<StreakData> => {
    try {
      const response = await apiService.getStreaks({ userId });
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error getting user streaks:", error);
      throw error;
    }
  },

  recordActivity: async (activity: string): Promise<void> => {
    try {
      await apiService.recordActivity(activity, "user-id"); // TODO: Get actual user ID
    } catch (error) {
      console.error("Error recording activity:", error);
      throw error;
    }
  },

  // Comments
  getComments: async (itemId: string, itemType: string): Promise<Comment[]> => {
    try {
      const response = await apiService.getComments(itemId, itemType);
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error getting comments:", error);
      throw error;
    }
  },

  postComment: async (
    itemId: string,
    itemType: string,
    content: string
  ): Promise<Comment> => {
    try {
      const response = await apiService.addComment(
        itemId,
        itemType,
        content,
        "user-id"
      ); // TODO: Get actual user ID
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error posting comment:", error);
      throw error;
    }
  },

  replyToComment: async (
    commentId: string,
    content: string
  ): Promise<Comment> => {
    try {
      const response = await apiService.replyToComment(
        commentId,
        content,
        "user-id"
      ); // TODO: Get actual user ID
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error replying to comment:", error);
      throw error;
    }
  },

  voteOnComment: async (
    commentId: string,
    vote: "up" | "down"
  ): Promise<void> => {
    try {
      await apiService.voteOnComment(commentId, vote, "user-id"); // TODO: Get actual user ID
    } catch (error) {
      console.error("Error voting on comment:", error);
      throw error;
    }
  },

  reportComment: async (commentId: string, reason: string): Promise<void> => {
    try {
      await apiService.reportComment(commentId, reason, "user-id"); // TODO: Get actual user ID
    } catch (error) {
      console.error("Error reporting comment:", error);
      throw error;
    }
  },

  // Verification
  getVerificationStatus: async (
    itemId: string,
    itemType: string
  ): Promise<VerificationStatus> => {
    try {
      const response = await apiService.getVerificationStatus(itemId, itemType);
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error getting verification status:", error);
      throw error;
    }
  },

  voteOnVerification: async (
    itemId: string,
    itemType: string,
    vote: "up" | "down"
  ): Promise<void> => {
    try {
      await apiService.voteOnVerification(
        itemId,
        itemType,
        vote === "up" ? "verify" : "reject",
        "user-id"
      ); // TODO: Get actual user ID
    } catch (error) {
      console.error("Error voting on verification:", error);
      throw error;
    }
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
      titleNepali?: string;
      description: string;
      descriptionNepali?: string;
      target: number;
      current: number;
      reward: string;
      completed: boolean;
    }>;
  }> => {
    try {
      const response = await apiService.getInviteStats(userId || "user-id"); // TODO: Get actual user ID
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error getting invite stats:", error);
      throw error;
    }
  },

  trackInvite: async (inviteCode: string): Promise<void> => {
    try {
      await apiService.trackInvite("inviter-id", inviteCode); // TODO: Get actual inviter ID
    } catch (error) {
      console.error("Error tracking invite:", error);
      throw error;
    }
  },

  // Election mode
  getElectionData: async (): Promise<ElectionData> => {
    try {
      const response = await apiService.getElectionData();
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error getting election data:", error);
      throw error;
    }
  },

  getCandidates: async (constituency?: string): Promise<Candidate[]> => {
    try {
      const response = await apiService.getCandidates({
        constituencyId: constituency,
      });
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error getting candidates:", error);
      throw error;
    }
  },

  compareCandidates: async (
    candidateIds: string[]
  ): Promise<{
    comparison: any;
    recommendations: string[];
  }> => {
    try {
      const response = await apiService.compareCandidatesViral(
        candidateIds[0],
        candidateIds[1]
      );
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error comparing candidates:", error);
      throw error;
    }
  },

  // Analytics and metrics
  getViralMetrics: async (): Promise<ViralMetrics> => {
    try {
      const response = await apiService.getViralMetrics();
      return formatApiResponse(response.data, "en");
    } catch (error) {
      console.error("Error getting viral metrics:", error);
      throw error;
    }
  },

  // Real-time updates
  subscribeToUpdates: (callback: (update: any) => void): (() => void) => {
    // This would typically use WebSocket or Server-Sent Events
    // For now, we'll implement a polling mechanism
    const interval = setInterval(async () => {
      try {
        await apiService.getUpdates([callback]);
      } catch (error) {
        console.error("Error getting updates:", error);
      }
    }, 30000); // Poll every 30 seconds

    return () => {
      clearInterval(interval);
    };
  },
};
