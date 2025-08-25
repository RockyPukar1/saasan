import express from "express";
import { PoliticianController } from "../controllers/PoliticianController";
import { authenticateToken } from "../middleware/auth";
const router = express.Router();

router.get("/", PoliticianController.getAll);
router.get("/:id", PoliticianController.getById);
router.get("/:id/promises", PoliticianController.getPromises);
router.post("/:id/rate", authenticateToken, PoliticianController.ratePolitician);

export default router;
