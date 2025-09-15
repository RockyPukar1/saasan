"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const ResponseHelper_1 = require("../lib/helpers/ResponseHelper");
const ValidationHelper_1 = require("../lib/helpers/ValidationHelper");
const CorruptionReportModel_1 = require("../models/CorruptionReportModel");
const database_1 = __importDefault(require("../config/database"));
const utils_1 = require("../lib/utils");
const types_1 = require("../types");
class ReportController {
    static async create(req, res) {
        try {
            const { error, value } = ValidationHelper_1.ValidationHelper.corruptionReport.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
            }
            const reportData = {
                ...value,
                reportId: value.isAnonymous ? null : req.user?.userId,
                status: "submitted",
                priority: "medium",
            };
            const report = await CorruptionReportModel_1.CorruptionReportModel.create(reportData);
            res
                .status(201)
                .json(ResponseHelper_1.ResponseHelper.success(report, "Report submitted successfully"));
        }
        catch (error) {
            console.error("Create report error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to create report"));
        }
    }
    static async getAll(req, res) {
        try {
            const { status, priority, categoryId, district, municipality, page = 1, limit = 20, sortBy = "createdAt", sortOrder = "desc", } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const result = await CorruptionReportModel_1.CorruptionReportModel.findAll({
                status: status,
                priority: priority,
                categoryId: categoryId ? Number(categoryId) : undefined,
                district: district,
                municipality: municipality,
                limit: Number(limit),
                offset,
                sortBy: sortBy,
                sortOrder: sortOrder,
                publicVisibility: "public",
            });
            res.json(ResponseHelper_1.ResponseHelper.paginated(result.reports, result.total, Number(page), Number(limit)));
        }
        catch (error) {
            console.error("Get all reports error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch reports"));
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const report = await CorruptionReportModel_1.CorruptionReportModel.findById(id);
            if (!report) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Report not found"));
                return;
            }
            // Increment view count
            await CorruptionReportModel_1.CorruptionReportModel.incrementViews(id);
            // Get evidence files
            const evidence = await (0, database_1.default)("report_evidence")
                .where({ reportId: id })
                .select("*");
            // Get updates/timeline
            const updates = await (0, database_1.default)("report_updates")
                .where({ reportId: id })
                .where({ isPublicVisible: true })
                .orderBy("createdAt", "desc");
            res.json(ResponseHelper_1.ResponseHelper.success({
                ...report,
                evidence,
                updates,
            }));
        }
        catch (error) {
            console.error("Get report by ID error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch report"));
        }
    }
    static async getUserReports(req, res) {
        try {
            const { page = 1, limit = 20 } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const result = await CorruptionReportModel_1.CorruptionReportModel.findAll({
                reporterId: req.user?.userId,
                limit: Number(limit),
                offset,
            });
            res.json(ResponseHelper_1.ResponseHelper.paginated(result.reports, result.total, Number(page), Number(limit)));
        }
        catch (error) {
            console.error("Get user reports error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to fetch user reports"));
        }
    }
    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, updateMessage } = req.body;
            // Only admins and investigators can update status
            if (!["admin", "investigator"].includes(req.user.role)) {
                res.status(403).json(ResponseHelper_1.ResponseHelper.error("Insufficient permissions"));
                return;
            }
            const report = await CorruptionReportModel_1.CorruptionReportModel.updateStatus(id, status, req.user.userId);
            // Add update to timeline
            if (updateMessage) {
                await (0, database_1.default)("report_updates").insert({
                    reportId: id,
                    status,
                    updateMessage,
                    officerId: req.user.userId,
                    isPublicVisible: true,
                    createdAt: new Date(),
                });
            }
            res.json(ResponseHelper_1.ResponseHelper.success(report, "Report status updated"));
        }
        catch (error) {
            console.error("Update report status error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to update report status"));
        }
    }
    static async uploadEvidence(req, res) {
        try {
            const { id } = req.params;
            const files = req.files;
            if (!files || files.length === 0) {
                res.status(400).json(ResponseHelper_1.ResponseHelper.error("No files uploaded"));
                return;
            }
            const evidenceRecords = [];
            for (const file of files) {
                const evidence = {
                    id: (0, utils_1.generateUUID)(),
                    reportId: id,
                    fileName: file.originalname,
                    fileType: file.mimetype.startsWith("image/") ? "photo" : "document",
                    fileUrl: file.path,
                    fileSizeBytes: file.size,
                    mimeType: file.mimetype,
                    isVerified: false,
                    uploadedAt: new Date(),
                    metadata: {
                        originalName: file.originalname,
                        cloudinaryId: file.public_id,
                    },
                };
                evidenceRecords.push(evidence);
            }
            await (0, database_1.default)("report_evidence").insert(evidenceRecords);
            res.json(ResponseHelper_1.ResponseHelper.success(evidenceRecords, "Evidence uploaded successfully"));
        }
        catch (error) {
            console.error("Upload evidence error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to upload evidence"));
        }
    }
    static async voteOnReport(req, res) {
        try {
            const { id } = req.params;
            const { voteType } = req.body; // "upvote"or "downvote"
            // Check if the user is already present
            const existingVote = await (0, database_1.default)("user_interactions")
                .where({
                userId: req.user.userId,
                targetType: "report",
                targetId: id,
            })
                .whereIn("interaction", ["upvote", "downvote"])
                .first();
            if (existingVote) {
                if (existingVote.interactionType === voteType) {
                    res.status(400).json(ResponseHelper_1.ResponseHelper.error("Already voted"));
                    return;
                }
                // update existing vote
                await (0, database_1.default)("user_interactions")
                    .where({ id: existingVote.id })
                    .update({ interactionType: voteType });
            }
            else {
                // Create new vote
                await (0, database_1.default)("user_interactions").insert({
                    userId: req.user.userId,
                    targetType: "report",
                    targetId: id,
                    interactionType: voteType,
                    createdAt: new Date(),
                });
            }
            // Update vote counts
            const votes = await (0, database_1.default)("user_interactions")
                .where({ targetType: "report", targetId: id })
                .whereIn("interactionType", ["upvote", "downVote"])
                .select("interactionType")
                .count("* as count")
                .groupBy("interactionType");
            const upvotes = votes.find((v) => v.interactionType === "upvote")?.count || 0;
            const downvotes = votes.find((v) => v.interactionType === "downvote")?.count || 0;
            await CorruptionReportModel_1.CorruptionReportModel.updateVotes(id, Number(upvotes), Number(downvotes));
            res.json(ResponseHelper_1.ResponseHelper.success({ upvotes, downvotes }, "Vote recorded"));
        }
        catch (error) {
            console.error("Vote on report error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to record vote"));
        }
    }
    // Admin functions for report management
    static async approve(req, res) {
        try {
            const { id } = req.params;
            const { comment } = req.body;
            const report = await CorruptionReportModel_1.CorruptionReportModel.updateStatus(id, types_1.ReportStatus.VERIFIED, req.user.userId);
            // Add update to timeline
            if (comment) {
                await (0, database_1.default)("report_updates").insert({
                    reportId: id,
                    status: types_1.ReportStatus.VERIFIED,
                    updateMessage: comment,
                    officerId: req.user.userId,
                    isPublicVisible: true,
                    createdAt: new Date(),
                });
            }
            res.json(ResponseHelper_1.ResponseHelper.success(report, "Report approved successfully"));
        }
        catch (error) {
            console.error("Approve report error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to approve report"));
        }
    }
    static async reject(req, res) {
        try {
            const { id } = req.params;
            const { comment } = req.body;
            if (!comment) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Rejection comment is required"));
                return;
            }
            const report = await CorruptionReportModel_1.CorruptionReportModel.updateStatus(id, types_1.ReportStatus.DISMISSED, req.user.userId);
            // Add update to timeline
            await (0, database_1.default)("report_updates").insert({
                reportId: id,
                status: types_1.ReportStatus.DISMISSED,
                updateMessage: comment,
                officerId: req.user.userId,
                isPublicVisible: true,
                createdAt: new Date(),
            });
            res.json(ResponseHelper_1.ResponseHelper.success(report, "Report rejected successfully"));
        }
        catch (error) {
            console.error("Reject report error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to reject report"));
        }
    }
    static async resolve(req, res) {
        try {
            const { id } = req.params;
            const { comment } = req.body;
            const report = await CorruptionReportModel_1.CorruptionReportModel.updateStatus(id, types_1.ReportStatus.RESOLVED, req.user.userId);
            // Add update to timeline
            if (comment) {
                await (0, database_1.default)("report_updates").insert({
                    reportId: id,
                    status: types_1.ReportStatus.RESOLVED,
                    updateMessage: comment,
                    officerId: req.user.userId,
                    isPublicVisible: true,
                    createdAt: new Date(),
                });
            }
            res.json(ResponseHelper_1.ResponseHelper.success(report, "Report resolved successfully"));
        }
        catch (error) {
            console.error("Resolve report error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to resolve report"));
        }
    }
}
exports.ReportController = ReportController;
