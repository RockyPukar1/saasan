import express from "express";
import { HistoricalEventController } from "../controllers/HistoricalEventController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Historical Events routes
router.get("/", HistoricalEventController.getAll);
router.get("/:id", HistoricalEventController.getById);
router.post("/", HistoricalEventController.create);
router.put("/:id", HistoricalEventController.update);
router.delete("/:id", HistoricalEventController.delete);
router.post("/bulk-upload", HistoricalEventController.bulkUpload);

export default router;
