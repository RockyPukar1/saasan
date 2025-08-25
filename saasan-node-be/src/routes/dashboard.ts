import express from "express";
import { DashboardController } from "../controllers/DashboardController";
const router = express.Router();

router.get("/stats", DashboardController.getStats);
router.get("/major-cases", DashboardController.getMajorCases);
router.get("/live-services", DashboardController.getLiveServices);

export default router;
