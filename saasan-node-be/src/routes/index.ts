import express from "express";

import authRoutes from "./auth";
import politicianRoutes from "./politicians";
import reportsRoutes from "./reports";
import dashboardRoutes from "./dashboard";
import locationRoutes from "./locations";
import pollRoutes from "./polls";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/politicians", politicianRoutes);
router.use("/reports", reportsRoutes);
router.use("/dashboard", dashboardRoutes);`` 
router.use("/locations", locationRoutes);
router.use("/polls", pollRoutes);

export default router;
