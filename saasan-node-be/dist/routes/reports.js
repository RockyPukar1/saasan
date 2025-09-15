"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const ReportController_1 = require("../controllers/ReportController");
const FileHelper_1 = require("../lib/helpers/FileHelper");
const router = express_1.default.Router();
router.post("/", auth_1.authenticateToken, ReportController_1.ReportController.create);
router.get("/", ReportController_1.ReportController.getAll);
router.get("/my-reports", auth_1.authenticateToken, ReportController_1.ReportController.getUserReports);
router.get("/:id", ReportController_1.ReportController.getById);
router.put("/:id/status", auth_1.authenticateToken, (0, auth_1.requireRole)(["admin", "investigator"]), ReportController_1.ReportController.updateStatus);
router.put("/:id/evidence", auth_1.authenticateToken, FileHelper_1.FileHelper.upload.array("evidence", 5), ReportController_1.ReportController.uploadEvidence);
router.post("/:id/vote", auth_1.authenticateToken, ReportController_1.ReportController.voteOnReport);
// Admin routes for report management
router.post("/:id/approve", auth_1.authenticateToken, (0, auth_1.requireRole)(["admin", "investigator"]), ReportController_1.ReportController.approve);
router.post("/:id/reject", auth_1.authenticateToken, (0, auth_1.requireRole)(["admin", "investigator"]), ReportController_1.ReportController.reject);
router.post("/:id/resolve", auth_1.authenticateToken, (0, auth_1.requireRole)(["admin", "investigator"]), ReportController_1.ReportController.resolve);
exports.default = router;
