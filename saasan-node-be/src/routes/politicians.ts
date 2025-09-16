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

// Get detailed politician profile with all data
router.get("/:id/detailed", PoliticianController.getDetailedProfile);

// Get politician promises
router.get("/:id/promises", PoliticianController.getPromises);

// Get politician achievements
router.get("/:id/achievements", PoliticianController.getAchievements);

// Get politician contacts
router.get("/:id/contacts", PoliticianController.getContacts);

// Get politician social media
router.get("/:id/social-media", PoliticianController.getSocialMedia);

// Get politician budget tracking
router.get("/:id/budget", PoliticianController.getBudgetTracking);

// Get politician attendance
router.get("/:id/attendance", PoliticianController.getAttendance);

// Get politician ratings by category
router.get("/:id/ratings", PoliticianController.getRatings);

// Rate politician (requires authentication)
router.post(
  "/:id/rate",
  authenticateToken,
  PoliticianController.ratePolitician
);

// Admin routes (require authentication)
router.post("/", authenticateToken, PoliticianController.create);
router.put("/:id", authenticateToken, PoliticianController.update);
router.delete("/:id", authenticateToken, PoliticianController.delete);
router.post("/bulk-upload", authenticateToken, PoliticianController.bulkUpload);

export default router;
