import db from "../config/database";

export class ViralService {
  // Share functionality
  static async generateShareContent(shareData: any, userId?: string) {
    const {
      type,
      title,
      description,
      location,
      amountInvolved,
      total_votes,
      options,
      name,
      position,
      constituency,
      rating,
    } = shareData;

    let viralText = "";
    let shareText = "";

    switch (type) {
      case "corruption_report":
        viralText = this.generateCorruptionViralText(
          title,
          location,
          amountInvolved
        );
        shareText = this.generateCorruptionShareText(
          title,
          description,
          location,
          amountInvolved
        );
        break;
      case "poll_result":
        viralText = this.generatePollViralText(title, options, total_votes);
        shareText = this.generatePollShareText(title, options, total_votes);
        break;
      case "politician_rating":
        viralText = this.generatePoliticianViralText(name, rating);
        shareText = this.generatePoliticianShareText(
          name,
          position,
          constituency,
          rating
        );
        break;
    }

    // Track the share generation
    if (userId) {
      await this.trackShare(shareData.id, type, "content_generation", userId);
    }

    return { viralText, shareText };
  }

  static async trackShare(
    itemId: string,
    itemType: string,
    platform: string,
    userId?: string
  ) {
    try {
      await db("viral_shares").insert({
        item_id: itemId,
        item_type: itemType,
        platform,
        user_id: userId,
        created_at: new Date(),
      });
    } catch (error) {
      console.error("Error tracking share:", error);
    }
  }

  // Badges and achievements
  static async getUserBadges(userId?: string) {
    try {
      // Return mock data for now
      return [
        {
          id: "first_report",
          name: "Whistleblower",
          description: "Submitted your first corruption report",
          category: "reporter",
          unlocked: true,
          progress: 1,
          maxProgress: 1,
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
    } catch (error) {
      console.error("Error fetching badges:", error);
      return [];
    }
  }

  static async unlockBadge(badgeId: string, userId: string) {
    try {
      // Mock implementation
      return {
        id: badgeId,
        userId,
        unlockedAt: new Date(),
      };
    } catch (error) {
      console.error("Error unlocking badge:", error);
      throw error;
    }
  }

  // Leaderboards
  static async getLeaderboard(type: string, period: string) {
    try {
      // Return mock data for now
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
        {
          rank: 3,
          name: "Bhaktapur District",
          location: "Bhaktapur",
          score: 750,
          metric: "reports",
          change: "same",
          badge: "consistent",
        },
      ];
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  }

  // Trending polls
  static async getTrendingPolls(limit: number) {
    try {
      // Return mock data for now
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
    } catch (error) {
      console.error("Error fetching trending polls:", error);
      return [];
    }
  }

  static async voteOnPoll(pollId: string, optionId: string, userId: string) {
    try {
      // Mock implementation
      return {
        success: true,
        message: "Vote recorded successfully",
      };
    } catch (error) {
      console.error("Error voting on poll:", error);
      throw error;
    }
  }

  // Transparency feed
  static async getTransparencyFeed(limit: number, offset: number) {
    try {
      // Return mock data for now
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
          viral_message:
            "💸 5M NPR MISUSED in Kathmandu — Reported on Saasan 🔥",
        },
      ];
    } catch (error) {
      console.error("Error fetching transparency feed:", error);
      return [];
    }
  }

  static async reactToFeedItem(
    itemId: string,
    reaction: string,
    userId: string
  ) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error("Error reacting to feed item:", error);
    }
  }

  // Streaks
  static async getUserStreaks(userId: string) {
    try {
      // Return mock data for now
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
    } catch (error) {
      console.error("Error fetching streaks:", error);
      return {
        dailyStreak: 0,
        weeklyStreak: 0,
        monthlyStreak: 0,
        longestDailyStreak: 0,
        longestWeeklyStreak: 0,
        totalDaysActive: 0,
        lastActivityDate: new Date().toISOString(),
        streakHistory: [],
      };
    }
  }

  static async recordActivity(
    activity: string,
    points: number,
    userId: string
  ) {
    try {
      // Mock implementation
      return { success: true };
    } catch (error) {
      console.error("Error recording activity:", error);
    }
  }

  // Comments
  static async getComments(itemId: string, itemType: string) {
    try {
      // Return mock data for now
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
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  }

  static async postComment(
    itemId: string,
    itemType: string,
    content: string,
    userId: string
  ) {
    try {
      // Mock implementation
      return {
        id: "new_comment",
        itemId,
        itemType,
        content,
        userId,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("Error posting comment:", error);
      throw error;
    }
  }

  // Helper methods
  private static generateCorruptionViralText(
    title: string,
    location: string,
    amount?: number
  ) {
    if (amount && amount > 1000000) {
      return `💸 ${(amount / 1000000).toFixed(
        1
      )}M NPR MISUSED in ${location} — Reported on Saasan 🔥`;
    } else if (amount && amount > 100000) {
      return `💸 ${(amount / 100000).toFixed(
        1
      )}L NPR MISUSED in ${location} — Reported on Saasan 🔥`;
    } else {
      return `🚨 CORRUPTION REPORTED in ${location} — Join the fight on Saasan 🔥`;
    }
  }

  private static generateCorruptionShareText(
    title: string,
    description: string,
    location: string,
    amount?: number
  ) {
    return `🚨 CORRUPTION ALERT 🚨\n\n"${title}"\n📍 ${location}\n💰 ${
      amount ? `Amount: ${amount}` : "Amount: Unknown"
    }\n\nReported on Saasan App\n#FightCorruption #SaasanApp #Nepal`;
  }

  private static generatePollViralText(
    title: string,
    options: any[],
    totalVotes: number
  ) {
    const topOption = options.reduce(
      (max, opt) => (opt.votes > max.votes ? opt : max),
      options[0]
    );
    const percentage = Math.round((topOption.votes / totalVotes) * 100);
    return `⚡ ${percentage}% of citizens say "${topOption.option}" — Join the poll on Saasan 📊`;
  }

  private static generatePollShareText(
    title: string,
    options: any[],
    totalVotes: number
  ) {
    const optionsText = options
      .map(
        (opt, i) =>
          `${i + 1}. ${opt.option}: ${opt.votes} votes (${Math.round(
            (opt.votes / totalVotes) * 100
          )}%)`
      )
      .join("\n");

    return `📊 POLL RESULT 📊\n\n"${title}"\n\n${optionsText}\n\nTotal Votes: ${totalVotes}\n\nVote on Saasan App\n#SaasanPoll #Nepal`;
  }

  private static generatePoliticianViralText(name: string, rating: number) {
    return `⭐ ${name} rated ${rating}/5 by citizens — Check ratings on Saasan 👤`;
  }

  private static generatePoliticianShareText(
    name: string,
    position: string,
    constituency: string,
    rating: number
  ) {
    return `👤 POLITICIAN RATING 👤\n\n${name}\n${position}\n📍 ${constituency}\n⭐ Rating: ${rating}/5\n\nRated on Saasan App\n#PoliticianRating #SaasanApp #Nepal`;
  }

  private static getViralPotential(trendingScore: number) {
    if (trendingScore >= 100) return "explosive";
    if (trendingScore >= 75) return "high";
    if (trendingScore >= 50) return "medium";
    return "low";
  }

  private static getPriority(amount: number, status: string) {
    if (amount > 10000000 || status === "verified") return "critical";
    if (amount > 1000000) return "high";
    if (amount > 100000) return "medium";
    return "low";
  }

  private static getPeriodStart(period: string) {
    const now = new Date();
    switch (period) {
      case "week":
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case "month":
        return new Date(now.getFullYear(), now.getMonth(), 1);
      default:
        return new Date(0); // All time
    }
  }

  private static async updateStreak(userId: string) {
    // This would implement streak calculation logic
    // For now, just a placeholder
  }
}
