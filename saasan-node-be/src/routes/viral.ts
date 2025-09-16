import express from "express";
import { authenticateToken } from "../middleware/auth";
import { ViralController } from "../controllers/viralController";

const router = express.Router();

// Share functionality
router.post(
  "/share-content",
  authenticateToken,
  ViralController.generateShareContent
);
router.post("/track-share", authenticateToken, ViralController.trackShare);

// Badges and achievements
router.get("/badges", authenticateToken, ViralController.getUserBadges);
router.post("/badges/unlock", authenticateToken, ViralController.unlockBadge);

// Leaderboards
router.get("/leaderboard", authenticateToken, ViralController.getLeaderboard);

// Trending polls
router.get(
  "/trending-polls",
  authenticateToken,
  ViralController.getTrendingPolls
);
router.post("/polls/vote", authenticateToken, ViralController.voteOnPoll);

// Transparency feed
router.get(
  "/transparency-feed",
  authenticateToken,
  ViralController.getTransparencyFeed
);
router.post("/feed/react", authenticateToken, ViralController.reactToFeedItem);

// Streaks
router.get("/streaks", authenticateToken, ViralController.getUserStreaks);
router.post(
  "/streaks/activity",
  authenticateToken,
  ViralController.recordActivity
);

// Comments
router.get("/comments", authenticateToken, ViralController.getComments);
router.post("/comments", authenticateToken, ViralController.postComment);
router.post(
  "/comments/reply",
  authenticateToken,
  ViralController.replyToComment
);
router.post("/comments/vote", authenticateToken, ViralController.voteOnComment);
router.post(
  "/comments/report",
  authenticateToken,
  ViralController.reportComment
);

// Verification
router.get(
  "/verification",
  authenticateToken,
  ViralController.getVerificationStatus
);
router.post(
  "/verification/vote",
  authenticateToken,
  ViralController.voteOnVerification
);

// Invite challenges
router.get("/invite-stats", authenticateToken, ViralController.getInviteStats);
router.post("/invite/track", authenticateToken, ViralController.trackInvite);

// Election mode
router.get(
  "/election-data",
  authenticateToken,
  ViralController.getElectionData
);
router.get("/candidates", authenticateToken, ViralController.getCandidates);
router.post(
  "/candidates/compare",
  authenticateToken,
  ViralController.compareCandidates
);

// Analytics and metrics
router.get("/metrics", authenticateToken, ViralController.getViralMetrics);
router.get("/updates", authenticateToken, ViralController.getUpdates);

export { router as viralRoutes };
