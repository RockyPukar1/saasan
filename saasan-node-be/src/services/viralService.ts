import db from "../config/database";
import { formatBilingualResponse } from "../lib/bilingual";

export interface Badge {
  id: string;
  name: string;
  nameNepali?: string;
  description: string;
  descriptionNepali?: string;
  category: string;
  rarity: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
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
  change?: string;
  badge?: string;
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
  options: any[];
  created_at: string;
  viral_potential: string;
  share_count: number;
  hashtags: string[];
}

export interface FeedItem {
  id: string;
  type: string;
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
  priority: string;
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
  streakHistory: any[];
}

export interface Comment {
  id: string;
  itemId: string;
  itemType: string;
  userId: string;
  content: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  replies: any[];
  isVerified: boolean;
  isAuthor: boolean;
}

export interface VerificationStatus {
  status: string;
  level: string;
  verifiedBy: string;
  verifiedAt: string;
  evidenceCount: number;
  communityVotes: any;
  credibilityScore: number;
  verificationNotes?: string;
}

export class ViralService {
  // Badges and achievements
  static async getUserBadges(userId?: string): Promise<Badge[]> {
    try {
      let query = db("badges").select("*").orderBy("created_at", "desc");

      if (userId) {
        // Get user's badge progress
        const userBadges = await db("user_badges")
          .select("badge_id", "unlocked_at", "progress")
          .where("user_id", userId);

        const badges = await query;

        return badges.map((badge: any) => {
          const userBadge = userBadges.find(
            (ub: any) => ub.badge_id === badge.id
          );
          return {
            id: badge.id,
            name: badge.name,
            nameNepali: badge.name_nepali,
            description: badge.description,
            descriptionNepali: badge.description_nepali,
            category: badge.category,
            rarity: badge.rarity,
            unlocked: !!userBadge,
            progress: userBadge?.progress || 0,
            maxProgress: badge.max_progress,
            unlockedAt: userBadge?.unlocked_at,
          };
        });
      }

      const badges = await query;
      return badges.map((badge: any) => ({
        id: badge.id,
        name: badge.name,
        nameNepali: badge.name_nepali,
        description: badge.description,
        descriptionNepali: badge.description_nepali,
        category: badge.category,
        rarity: badge.rarity,
        unlocked: false,
        progress: 0,
        maxProgress: badge.max_progress,
      }));
    } catch (error) {
      console.error("Error getting user badges:", error);
      throw error;
    }
  }

  static async unlockBadge(badgeId: string, userId: string): Promise<Badge> {
    try {
      const badge = await db("badges").where("id", badgeId).first();
      if (!badge) {
        throw new Error("Badge not found");
      }

      await db("user_badges").insert({
        user_id: userId,
        badge_id: badgeId,
        unlocked_at: new Date(),
        progress: badge.max_progress || 1,
      });

      return {
        id: badge.id,
        name: badge.name,
        nameNepali: badge.name_nepali,
        description: badge.description,
        descriptionNepali: badge.description_nepali,
        category: badge.category,
        rarity: badge.rarity,
        unlocked: true,
        progress: badge.max_progress || 1,
        maxProgress: badge.max_progress,
        unlockedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error unlocking badge:", error);
      throw error;
    }
  }

  // Leaderboards
  static async getLeaderboard(
    type: string,
    period: string
  ): Promise<LeaderboardEntry[]> {
    try {
      let query;

      if (type === "reports") {
        query = db("corruption_reports")
          .select(
            "c.name as location",
            "c.name_nepali as location_nepali",
            db.raw("COUNT(*) as score")
          )
          .leftJoin(
            "constituencies as c",
            "corruption_reports.constituency_id",
            "c.id"
          )
          .groupBy("c.id", "c.name", "c.name_nepali")
          .orderBy("score", "desc")
          .limit(10);
      } else if (type === "participation") {
        query = db("polls")
          .select(
            "c.name as location",
            "c.name_nepali as location_nepali",
            db.raw("SUM(p.total_votes) as score")
          )
          .leftJoin("constituencies as c", "polls.constituency_id", "c.id")
          .groupBy("c.id", "c.name", "c.name_nepali")
          .orderBy("score", "desc")
          .limit(10);
      } else {
        // corruption_fighters - combine reports and participation
        query = db.raw(`
          SELECT 
            c.name as location,
            c.name_nepali as location_nepali,
            (COALESCE(r.report_count, 0) + COALESCE(p.poll_participation, 0)) as score
          FROM constituencies c
          LEFT JOIN (
            SELECT constituency_id, COUNT(*) as report_count
            FROM corruption_reports
            GROUP BY constituency_id
          ) r ON c.id = r.constituency_id
          LEFT JOIN (
            SELECT constituency_id, SUM(total_votes) as poll_participation
            FROM polls
            GROUP BY constituency_id
          ) p ON c.id = p.constituency_id
          ORDER BY score DESC
          LIMIT 10
        `);
      }

      const results = await query;

      return results.map((row: any, index: number) => ({
        rank: index + 1,
        name: row.location || "Unknown",
        nameNepali: row.location_nepali,
        location: row.location || "Unknown",
        locationNepali: row.location_nepali,
        score: parseInt(row.score) || 0,
        metric: type,
        change: "same",
        badge: index < 3 ? "champion" : index < 7 ? "rising" : "consistent",
      }));
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      throw error;
    }
  }

  // Trending polls
  static async getTrendingPolls(limit: number): Promise<TrendingPoll[]> {
    try {
      const polls = await db("polls")
        .select(
          "p.*",
          "po.id as option_id",
          "po.option_text",
          "po.option_text_nepali",
          "po.vote_count",
          db.raw(
            "(po.vote_count * 100.0 / NULLIF(p.total_votes, 0)) as percentage"
          )
        )
        .from("polls as p")
        .leftJoin("poll_options as po", "p.id", "po.poll_id")
        .where("p.is_active", true)
        .where("p.created_at", ">=", db.raw("NOW() - INTERVAL '7 days'"))
        .orderBy("p.total_votes", "desc")
        .limit(limit);

      // Group polls with their options
      const pollsMap = new Map();

      polls.forEach((row: any) => {
        if (!pollsMap.has(row.id)) {
          pollsMap.set(row.id, {
            id: row.id,
            title: row.title,
            titleNepali: row.title_nepali,
            description: row.description,
            descriptionNepali: row.description_nepali,
            category: row.category,
            categoryNepali: row.category_nepali,
            total_votes: row.total_votes,
            trending_score: Math.min(100, (row.total_votes / 100) * 10),
            options: [],
            created_at: row.created_at,
            viral_potential:
              row.total_votes > 500
                ? "high"
                : row.total_votes > 100
                ? "medium"
                : "low",
            share_count: Math.floor(row.total_votes * 0.2),
            hashtags: row.hashtags || [],
          });
        }

        if (row.option_id) {
          pollsMap.get(row.id).options.push({
            id: row.option_id,
            option: row.option_text,
            optionNepali: row.option_text_nepali,
            votes: row.vote_count,
            percentage: parseFloat(row.percentage) || 0,
          });
        }
      });

      return Array.from(pollsMap.values());
    } catch (error) {
      console.error("Error getting trending polls:", error);
      throw error;
    }
  }

  static async voteOnPoll(
    pollId: string,
    optionId: string,
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Check if user already voted
      const existingVote = await db("poll_votes")
        .where("poll_id", pollId)
        .where("user_id", userId)
        .first();

      if (existingVote) {
        return {
          success: false,
          message: "You have already voted on this poll",
        };
      }

      // Record the vote
      await db("poll_votes").insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: userId,
        voted_at: new Date(),
      });

      // Update vote counts
      await db("poll_options").where("id", optionId).increment("vote_count", 1);

      await db("polls").where("id", pollId).increment("total_votes", 1);

      return { success: true, message: "Vote recorded successfully" };
    } catch (error) {
      console.error("Error voting on poll:", error);
      throw error;
    }
  }

  // Transparency feed
  static async getTransparencyFeed(
    limit: number,
    offset: number
  ): Promise<FeedItem[]> {
    try {
      const reports = await db("corruption_reports")
        .select(
          "r.*",
          "c.name as constituency_name",
          "c.name_nepali as constituency_name_nepali",
          "p.name as province_name",
          "p.name_nepali as province_name_nepali"
        )
        .from("corruption_reports as r")
        .leftJoin("constituencies as c", "r.constituency_id", "c.id")
        .leftJoin("provinces as p", "c.province_id", "p.id")
        .where("r.status", "verified")
        .orderBy("r.created_at", "desc")
        .limit(limit)
        .offset(offset);

      return reports.map((report: any) => ({
        id: report.id.toString(),
        type: "corruption_report",
        title: report.title,
        titleNepali: report.title_nepali,
        description: report.description,
        descriptionNepali: report.description_nepali,
        location: report.constituency_name,
        locationNepali: report.constituency_name_nepali,
        amount: report.amount_involved,
        timestamp: report.created_at,
        viral_score: Math.min(100, (report.upvotes_count / 10) * 5),
        share_count: Math.floor(report.upvotes_count * 0.3),
        reaction_count: report.upvotes_count + report.downvotes_count,
        is_verified: report.status === "verified",
        priority: report.priority,
        tags: report.tags || [],
        viral_message: `🚨 ${report.title} — Reported on Saasan 🔥`,
      }));
    } catch (error) {
      console.error("Error getting transparency feed:", error);
      throw error;
    }
  }

  static async reactToFeedItem(
    itemId: string,
    reaction: string,
    userId: string
  ): Promise<{ success: boolean }> {
    try {
      await db("report_reactions").insert({
        report_id: itemId,
        user_id: userId,
        reaction_type: reaction,
        created_at: new Date(),
      });

      // Update vote count
      const field = reaction === "upvote" ? "upvotes_count" : "downvotes_count";
      await db("corruption_reports").where("id", itemId).increment(field, 1);

      return { success: true };
    } catch (error) {
      console.error("Error reacting to feed item:", error);
      throw error;
    }
  }

  // Streaks
  static async getUserStreaks(userId: string): Promise<StreakData> {
    try {
      const userActivity = await db("user_activities")
        .where("user_id", userId)
        .orderBy("activity_date", "desc")
        .limit(30);

      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      let dailyStreak = 0;
      let weeklyStreak = 0;
      let monthlyStreak = 0;
      let longestDailyStreak = 0;
      let currentStreak = 0;

      // Calculate streaks
      const activityDates = userActivity.map((a: any) => a.activity_date);
      const uniqueDates = [...new Set(activityDates)];

      for (let i = 0; i < uniqueDates.length; i++) {
        const currentDate = new Date(uniqueDates[i]);
        const nextDate = new Date(uniqueDates[i + 1] || "");

        if (
          i === 0 ||
          Math.abs(
            currentDate.getTime() - new Date(uniqueDates[i - 1]).getTime()
          ) <= 86400000
        ) {
          currentStreak++;
          longestDailyStreak = Math.max(longestDailyStreak, currentStreak);
        } else {
          currentStreak = 1;
        }
      }

      dailyStreak = currentStreak;
      weeklyStreak = Math.floor(dailyStreak / 7);
      monthlyStreak = Math.floor(dailyStreak / 30);

      return {
        dailyStreak,
        weeklyStreak,
        monthlyStreak,
        longestDailyStreak,
        longestWeeklyStreak: Math.floor(longestDailyStreak / 7),
        totalDaysActive: uniqueDates.length,
        lastActivityDate:
          userActivity[0]?.activity_date || new Date().toISOString(),
        streakHistory: userActivity.slice(0, 7).map((activity: any) => ({
          date: activity.activity_date,
          activities: [activity.activity_type],
          points: activity.points_earned,
        })),
      };
    } catch (error) {
      console.error("Error getting user streaks:", error);
      throw error;
    }
  }

  static async recordActivity(
    activity: string,
    points: number,
    userId: string
  ): Promise<{ success: boolean }> {
    try {
      await db("user_activities").insert({
        user_id: userId,
        activity_type: activity,
        points_earned: points,
        activity_date: new Date().toISOString().split("T")[0],
        created_at: new Date(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error recording activity:", error);
      throw error;
    }
  }

  // Comments
  static async getComments(
    itemId: string,
    itemType: string
  ): Promise<Comment[]> {
    try {
      const comments = await db("comments")
        .select(
          "c.*",
          "u.username as author",
          db.raw("COUNT(cl.id) as likes"),
          db.raw("COUNT(cd.id) as dislikes")
        )
        .from("comments as c")
        .leftJoin("users as u", "c.user_id", "u.id")
        .leftJoin("comment_likes as cl", function () {
          this.on("c.id", "=", "cl.comment_id").andOn(
            "cl.like_type",
            "=",
            db.raw("?", ["up"])
          );
        })
        .leftJoin("comment_likes as cd", function () {
          this.on("c.id", "=", "cd.comment_id").andOn(
            "cd.like_type",
            "=",
            db.raw("?", ["down"])
          );
        })
        .where("c.item_id", itemId)
        .where("c.item_type", itemType)
        .groupBy("c.id", "u.username")
        .orderBy("c.created_at", "desc");

      return comments.map((comment: any) => ({
        id: comment.id.toString(),
        itemId: comment.item_id,
        itemType: comment.item_type,
        userId: comment.user_id,
        content: comment.content,
        timestamp: comment.created_at,
        likes: parseInt(comment.likes) || 0,
        dislikes: parseInt(comment.dislikes) || 0,
        replies: [], // TODO: Implement nested replies
        isVerified: false,
        isAuthor: false,
      }));
    } catch (error) {
      console.error("Error getting comments:", error);
      throw error;
    }
  }

  static async postComment(
    itemId: string,
    itemType: string,
    content: string,
    userId: string
  ): Promise<Comment> {
    try {
      const [comment] = await db("comments")
        .insert({
          item_id: itemId,
          item_type: itemType,
          user_id: userId,
          content,
          created_at: new Date(),
        })
        .returning("*");

      return {
        id: comment.id.toString(),
        itemId: comment.item_id,
        itemType: comment.item_type,
        userId: comment.user_id,
        content: comment.content,
        timestamp: comment.created_at,
        likes: 0,
        dislikes: 0,
        replies: [],
        isVerified: false,
        isAuthor: true,
      };
    } catch (error) {
      console.error("Error posting comment:", error);
      throw error;
    }
  }

  static async replyToComment(
    commentId: string,
    content: string,
    userId: string
  ): Promise<Comment> {
    try {
      const parentComment = await db("comments").where("id", commentId).first();
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }

      const [reply] = await db("comments")
        .insert({
          item_id: parentComment.item_id,
          item_type: parentComment.item_type,
          user_id: userId,
          content,
          parent_comment_id: commentId,
          created_at: new Date(),
        })
        .returning("*");

      return {
        id: reply.id.toString(),
        itemId: reply.item_id,
        itemType: reply.item_type,
        userId: reply.user_id,
        content: reply.content,
        timestamp: reply.created_at,
        likes: 0,
        dislikes: 0,
        replies: [],
        isVerified: false,
        isAuthor: true,
      };
    } catch (error) {
      console.error("Error replying to comment:", error);
      throw error;
    }
  }

  static async voteOnComment(
    commentId: string,
    vote: string,
    userId: string
  ): Promise<{ success: boolean }> {
    try {
      // Check if user already voted
      const existingVote = await db("comment_likes")
        .where("comment_id", commentId)
        .where("user_id", userId)
        .first();

      if (existingVote) {
        // Update existing vote
        await db("comment_likes")
          .where("comment_id", commentId)
          .where("user_id", userId)
          .update({
            like_type: vote,
            updated_at: new Date(),
          });
      } else {
        // Create new vote
        await db("comment_likes").insert({
          comment_id: commentId,
          user_id: userId,
          like_type: vote,
          created_at: new Date(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error voting on comment:", error);
      throw error;
    }
  }

  static async reportComment(
    commentId: string,
    reason: string,
    userId: string
  ): Promise<{ success: boolean }> {
    try {
      await db("comment_reports").insert({
        comment_id: commentId,
        user_id: userId,
        reason,
        created_at: new Date(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error reporting comment:", error);
      throw error;
    }
  }

  // Verification
  static async getVerificationStatus(
    itemId: string,
    itemType: string
  ): Promise<VerificationStatus> {
    try {
      if (itemType === "corruption_report") {
        const report = await db("corruption_reports")
          .where("id", itemId)
          .first();
        if (!report) {
          throw new Error("Report not found");
        }

        return {
          status: report.status,
          level:
            report.priority === "urgent"
              ? "high"
              : report.priority === "high"
              ? "medium"
              : "low",
          verifiedBy: report.verified_by || "Community",
          verifiedAt: report.verified_at || report.created_at,
          evidenceCount: report.evidence_count || 0,
          communityVotes: {
            upvotes: report.upvotes_count || 0,
            downvotes: report.downvotes_count || 0,
            totalVoters:
              (report.upvotes_count || 0) + (report.downvotes_count || 0),
          },
          credibilityScore: Math.min(
            100,
            ((report.upvotes_count || 0) /
              Math.max(
                1,
                (report.upvotes_count || 0) + (report.downvotes_count || 0)
              )) *
              100
          ),
          verificationNotes: report.verification_notes,
        };
      }

      return {
        status: "citizen_report",
        level: "low",
        verifiedBy: "Community",
        verifiedAt: new Date().toISOString(),
        evidenceCount: 0,
        communityVotes: { upvotes: 0, downvotes: 0, totalVoters: 0 },
        credibilityScore: 0,
      };
    } catch (error) {
      console.error("Error getting verification status:", error);
      throw error;
    }
  }

  static async voteOnVerification(
    itemId: string,
    itemType: string,
    vote: string,
    userId: string
  ): Promise<{ success: boolean }> {
    try {
      if (itemType === "corruption_report") {
        await db("report_reactions").insert({
          report_id: itemId,
          user_id: userId,
          reaction_type: vote === "up" ? "upvote" : "downvote",
          created_at: new Date(),
        });

        const field = vote === "up" ? "upvotes_count" : "downvotes_count";
        await db("corruption_reports").where("id", itemId).increment(field, 1);
      }

      return { success: true };
    } catch (error) {
      console.error("Error voting on verification:", error);
      throw error;
    }
  }

  // Viral metrics
  static async getViralMetrics(): Promise<any> {
    try {
      const totalShares = await db("viral_shares").count("* as count").first();
      const totalVotes = await db("poll_votes").count("* as count").first();
      const totalComments = await db("comments").count("* as count").first();
      const activeUsers = await db("users")
        .where("last_active_at", ">=", db.raw("NOW() - INTERVAL '7 days'"))
        .count("* as count")
        .first();

      const topSharedContent = await db("viral_shares")
        .select("item_id", "item_type", db.raw("COUNT(*) as share_count"))
        .groupBy("item_id", "item_type")
        .orderBy("share_count", "desc")
        .limit(5);

      return {
        totalShares: parseInt(String(totalShares?.count || 0)),
        totalVotes: parseInt(String(totalVotes?.count || 0)),
        totalComments: parseInt(String(totalComments?.count || 0)),
        activeUsers: parseInt(String(activeUsers?.count || 0)),
        viralScore: 75, // TODO: Calculate based on engagement metrics
        topSharedContent: topSharedContent.map((item: any) => ({
          id: item.item_id,
          type: item.item_type,
          shareCount: parseInt(item.share_count),
        })),
        trendingHashtags: [], // TODO: Extract from content
        viralTrends: [], // TODO: Calculate trends over time
      };
    } catch (error) {
      console.error("Error getting viral metrics:", error);
      throw error;
    }
  }

  // Share functionality
  static async generateShareContent(
    shareData: any,
    userId: string
  ): Promise<any> {
    try {
      // Generate viral text based on content type
      let viralText = "";
      let shareText = "";

      switch (shareData.type) {
        case "corruption_report":
          viralText = `🚨 Corruption Alert: ${shareData.title}\n\n${
            shareData.description
          }\n\nLocation: ${shareData.location}\nAmount: ₹${
            shareData.amountInvolved?.toLocaleString() || "Unknown"
          }\n\n#CorruptionFight #Transparency #Saasan`;
          shareText = `Check out this corruption report on Saasan: ${shareData.title}`;
          break;
        case "poll_result":
          viralText = `📊 Poll Results: ${shareData.title}\n\n${
            shareData.description
          }\n\nTotal Votes: ${
            shareData.total_votes
          }\n\nVote breakdown:\n${shareData.options
            ?.map(
              (opt: any) =>
                `• ${opt.option}: ${opt.votes} votes (${opt.percentage}%)`
            )
            .join("\n")}\n\n#PollResults #Democracy #Saasan`;
          shareText = `See the poll results: ${shareData.title}`;
          break;
        case "politician_rating":
          viralText = `⭐ Politician Rating: ${shareData.name}\n\nPosition: ${shareData.position}\nConstituency: ${shareData.constituency}\nRating: ${shareData.rating}/5 stars\n\n#PoliticianRating #Transparency #Saasan`;
          shareText = `Check out this politician rating: ${shareData.name}`;
          break;
        default:
          viralText = `Check this out on Saasan: ${shareData.title}`;
          shareText = `Check this out on Saasan: ${shareData.title}`;
      }

      return {
        viralText,
        shareText,
      };
    } catch (error) {
      console.error("Error generating share content:", error);
      throw error;
    }
  }

  static async trackShare(
    itemId: string,
    itemType: string,
    platform: string,
    userId: string
  ): Promise<void> {
    try {
      await db("viral_shares").insert({
        item_id: itemId,
        item_type: itemType,
        platform: platform,
        user_id: userId,
        shared_at: new Date(),
      });
    } catch (error) {
      console.error("Error tracking share:", error);
      throw error;
    }
  }
}
