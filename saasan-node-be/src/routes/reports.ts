import express from "express";
import { authenticateToken, requireRole } from "../middleware/auth";
import { ReportController } from "../controllers/ReportController";
import { FileHelper } from "../lib/helpers/FileHelper";
const router = express.Router();

router.post("/", authenticateToken, ReportController.create);
router.get("/", ReportController.getAll);
router.get("/my-reports", authenticateToken, ReportController.getUserReports);
router.get("/:id", ReportController.getById);
router.put(
  "/:id/status",
  authenticateToken,
  requireRole(["admin", "investigator"]),
  ReportController.updateStatus
);
router.put(
  "/:id/evidence",
  authenticateToken,
  FileHelper.upload.array("evidence", 5),
  ReportController.uploadEvidence
);
router.post("/:id/vote", authenticateToken, ReportController.voteOnReport);

// Admin routes for report management
router.post(
  "/:id/approve",
  authenticateToken,
  requireRole(["admin", "investigator"]),
  ReportController.approve
);
router.post(
  "/:id/reject",
  authenticateToken,
  requireRole(["admin", "investigator"]),
  ReportController.reject
);
router.post(
  "/:id/resolve",
  authenticateToken,
  requireRole(["admin", "investigator"]),
  ReportController.resolve
);

export default router;
