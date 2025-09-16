import { Request, Response } from "express";
import { ViralService } from "../services/viralService";

export class ViralController {
  // Share functionality
  static async generateShareContent(req: Request, res: Response) {
    try {
      const {
        id,
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
      } = req.body;
      const userId = (req as any).user?.id;

      const shareData = {
        id,
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
      };

      const result = await ViralService.generateShareContent(shareData, userId);
      res.json(result);
    } catch (error) {
      console.error("Error generating share content:", error);
      res.status(500).json({ error: "Failed to generate share content" });
    }
  }

  static async trackShare(req: Request, res: Response) {
    try {
      const { itemId, itemType, platform } = req.body;
      const userId = (req as any).user?.id;

      await ViralService.trackShare(itemId, itemType, platform, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking share:", error);
      res.status(500).json({ error: "Failed to track share" });
    }
  }

  // Badges and achievements
  static async getUserBadges(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const badges = await ViralService.getUserBadges(userId);
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ error: "Failed to fetch badges" });
    }
  }

  static async unlockBadge(req: Request, res: Response) {
    try {
      const { badgeId } = req.body;
      const userId = (req as any).user?.id;

      const badge = await ViralService.unlockBadge(badgeId, userId);
      res.json(badge);
    } catch (error) {
      console.error("Error unlocking badge:", error);
      res.status(500).json({ error: "Failed to unlock badge" });
    }
  }

  // Leaderboards
  static async getLeaderboard(req: Request, res: Response) {
    try {
      const { type, period } = req.query;
      const leaderboard = await ViralService.getLeaderboard(
        type as string,
        period as string
      );
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  }

  // Trending polls
  static async getTrendingPolls(req: Request, res: Response) {
    try {
      const { limit = 10 } = req.query;
      const polls = await ViralService.getTrendingPolls(
        parseInt(limit as string)
      );
      res.json(polls);
    } catch (error) {
      console.error("Error fetching trending polls:", error);
      res.status(500).json({ error: "Failed to fetch trending polls" });
    }
  }

  static async voteOnPoll(req: Request, res: Response) {
    try {
      const { pollId, optionId } = req.body;
      const userId = (req as any).user?.id;

      const result = await ViralService.voteOnPoll(pollId, optionId, userId);
      res.json(result);
    } catch (error) {
      console.error("Error voting on poll:", error);
      res.status(500).json({ error: "Failed to vote on poll" });
    }
  }

  // Transparency feed
  static async getTransparencyFeed(req: Request, res: Response) {
    try {
      const { limit = 20, offset = 0 } = req.query;
      const feed = await ViralService.getTransparencyFeed(
        parseInt(limit as string),
        parseInt(offset as string)
      );
      res.json(feed);
    } catch (error) {
      console.error("Error fetching transparency feed:", error);
      res.status(500).json({ error: "Failed to fetch transparency feed" });
    }
  }

  static async reactToFeedItem(req: Request, res: Response) {
    try {
      const { itemId, reaction } = req.body;
      const userId = (req as any).user?.id;

      await ViralService.reactToFeedItem(itemId, reaction, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error reacting to feed item:", error);
      res.status(500).json({ error: "Failed to react to feed item" });
    }
  }

  // Streaks
  static async getUserStreaks(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const streaks = await ViralService.getUserStreaks(userId);
      res.json(streaks);
    } catch (error) {
      console.error("Error fetching streaks:", error);
      res.status(500).json({ error: "Failed to fetch streaks" });
    }
  }

  static async recordActivity(req: Request, res: Response) {
    try {
      const { activity, points } = req.body;
      const userId = (req as any).user?.id;

      await ViralService.recordActivity(activity, points, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error recording activity:", error);
      res.status(500).json({ error: "Failed to record activity" });
    }
  }

  // Comments
  static async getComments(req: Request, res: Response) {
    try {
      const { itemId, itemType } = req.query;
      const comments = await ViralService.getComments(
        itemId as string,
        itemType as string
      );
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  }

  static async postComment(req: Request, res: Response) {
    try {
      const { itemId, itemType, content } = req.body;
      const userId = (req as any).user?.id;

      const comment = await ViralService.postComment(
        itemId,
        itemType,
        content,
        userId
      );
      res.json(comment);
    } catch (error) {
      console.error("Error posting comment:", error);
      res.status(500).json({ error: "Failed to post comment" });
    }
  }

  // Placeholder methods for future implementation
  static async replyToComment(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented yet" });
  }

  static async voteOnComment(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented yet" });
  }

  static async reportComment(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented yet" });
  }

  // Verification
  static async getVerificationStatus(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented yet" });
  }

  static async voteOnVerification(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented yet" });
  }

  // Invite challenges
  static async getInviteStats(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented yet" });
  }

  static async trackInvite(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented yet" });
  }

  // Election mode
  static async getElectionData(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented yet" });
  }

  static async getCandidates(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented yet" });
  }

  static async compareCandidates(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented yet" });
  }

  // Analytics and metrics
  static async getViralMetrics(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented yet" });
  }

  static async getUpdates(req: Request, res: Response) {
    res.status(501).json({ error: "Not implemented yet" });
  }
}
