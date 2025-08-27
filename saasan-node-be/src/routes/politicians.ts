import express from "express";
import { PoliticianController } from "../controllers/PoliticianController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Get all politicians with optional level filtering
router.get("/", PoliticianController.getAll);

// Get government levels with counts
router.get("/levels", PoliticianController.getGovernmentLevels);

// Get politicians by specific level (using lowercase)
router.get("/level/:level", PoliticianController.getByLevel);

// Get individual politician
router.get("/:id", PoliticianController.getById);

// Get politician promises
router.get("/:id/promises", PoliticianController.getPromises);

// Rate politician (requires authentication)
router.post(
  "/:id/rate",
  authenticateToken,
  PoliticianController.ratePolitician
);

export default router;
