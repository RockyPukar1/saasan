import express from "express";
import { PollController } from "../controllers/PollController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", PollController.getAll);
router.get("/:id", PollController.getById);
router.get("/:id/stats", PollController.getStats);

// Protected routes (require authentication)
router.post("/", authenticateToken, PollController.create);
router.put("/:id", authenticateToken, PollController.update);
router.delete("/:id", authenticateToken, PollController.delete);
router.post("/:id/options", authenticateToken, PollController.addOption);
router.post("/:id/vote/:optionId", authenticateToken, PollController.vote);

export default router;
