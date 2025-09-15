import express from "express";
import { MajorCaseController } from "../controllers/MajorCaseController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Major Cases routes
router.get("/", MajorCaseController.getAll);
router.get("/:id", MajorCaseController.getById);
router.post("/", MajorCaseController.create);
router.put("/:id", MajorCaseController.update);
router.delete("/:id", MajorCaseController.delete);
router.put("/:id/status", MajorCaseController.updateStatus);

export default router;
