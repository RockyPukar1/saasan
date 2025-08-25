import express from "express";

import authRoutes from "./auth";
import politicianRoutes from "./politicians";
import reportsRoutes from "./reports";
import dashboardRoutes from "./dashboard";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/politicians", politicianRoutes);
router.use("/reports", reportsRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
