import express from "express";
import { authenticateToken, requireRole,  } from "../middleware/auth";
import { ReportController } from "../controllers/ReportController";
import { FileHelper } from "../lib/helpers/FileHelper";
const router = express.Router();

router.post("/", authenticateToken, ReportController.create);
router.get("/", ReportController.getAll);
router.get("/my-reports", authenticateToken, ReportController.getUserReports);
router.get("/:id", ReportController.getById);
router.put("/:id/status", authenticateToken, requireRole(["admin", "investigator"]), ReportController.updateStatus);
router.put("/:id/evidence", authenticateToken,FileHelper.upload.array("evidence", 5), ReportController.uploadEvidence);
router.post("/:id/vote", authenticateToken, ReportController.voteOnReport);

export default router;
