import express from "express";
import { PollController } from "../controllers/PollController";
import { PollingController } from "../controllers/PollingController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Public routes - specific routes first
router.get("/analytics", PollingController.getAnalytics);
router.get("/categories", PollingController.getCategories);
router.get("/statuses", PollingController.getStatuses);
router.get(
  "/politician/:politicianId/comparison",
  PollingController.getPoliticianComparison
);
router.get("/party/:partyId/comparison", PollingController.getPartyComparison);
router.get("/", PollController.getAll);
router.get("/:id/stats", PollController.getStats);
router.get("/:id", PollController.getById);

// Protected routes (require authentication)
router.post("/", authenticateToken, PollController.create);
router.put("/:id", authenticateToken, PollController.update);
router.delete("/:id", authenticateToken, PollController.delete);
router.post("/:id/options", authenticateToken, PollController.addOption);
router.post("/:id/vote/:optionId", authenticateToken, PollController.vote);

export default router;
