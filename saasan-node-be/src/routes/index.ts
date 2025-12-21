import express from "express";

import authRoutes from "./auth";
import politicianRoutes from "./politicians";
import reportsRoutes from "./reports";
import dashboardRoutes from "./dashboard";
import locationRoutes from "./locations";
import pollRoutes from "./polls";
import historicalEventRoutes from "./historical-events";
import majorCaseRoutes from "./major-cases";
import { viralRoutes } from "./viral";
import campaignRoutes from "./campaignRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/politicians", politicianRoutes);
router.use("/reports", reportsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/locations", locationRoutes);
router.use("/poll", pollRoutes);
router.use("/historical-events", historicalEventRoutes);
router.use("/major-cases", majorCaseRoutes);
router.use("/viral", viralRoutes);
router.use("/campaign", campaignRoutes);

export default router;
