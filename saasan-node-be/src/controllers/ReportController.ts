import { Request, Response } from "express";
import { ResponseHelper } from "../lib/helpers/ResponseHelper";
import { ValidationHelper } from "../lib/helpers/ValidationHelper";
import { CorruptionReportModel } from "../models/CorruptionReportModel";
import db from "../config/database";
import { generateUUID } from "../lib/utils";
import { ReportStatus } from "../types";

export class ReportController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = ValidationHelper.corruptionReport.validate(
        req.body
      );

      if (error) {
        res
          .status(400)
          .json(ResponseHelper.error("Validation failed", 400, error.details));
      }

      const reportData = {
        ...value,
        reportId: value.isAnonymous ? null : req.user?.userId,
        status: "submitted",
        priority: "medium",
      };

      const report = await CorruptionReportModel.create(reportData);
      res
        .status(201)
        .json(ResponseHelper.success(report, "Report submitted successfully"));
    } catch (error) {
      console.error("Create report error:", error);
      res.status(500).json(ResponseHelper.error("Failed to create report"));
    }
  }

  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {
        status,
        priority,
        categoryId,
        district,
        municipality,
        page = 1,
        limit = 20,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      const result = await CorruptionReportModel.findAll({
        status: status as any,
        priority: priority as any,
        categoryId: categoryId ? Number(categoryId) : undefined,
        district: district as string,
        municipality: municipality as string,
        limit: Number(limit),
        offset,
        sortBy: sortBy as string,
        sortOrder: sortOrder as "asc" | "desc",
        publicVisibility: "public",
      });

      res.json(
        ResponseHelper.paginated(
          result.reports,
          result.total,
          Number(page),
          Number(limit)
        )
      );
    } catch (error) {
      console.error("Get all reports error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch reports"));
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const report = await CorruptionReportModel.findById(id);

      if (!report) {
        res.status(404).json(ResponseHelper.error("Report not found"));
        return;
      }

      // Increment view count
      await CorruptionReportModel.incrementViews(id);

      // Get evidence files
      const evidence = await db("report_evidence")
        .where({ reportId: id })
        .select("*");

      // Get updates/timeline
      const updates = await db("report_updates")
        .where({ reportId: id })
        .where({ isPublicVisible: true })
        .orderBy("createdAt", "desc");

      res.json(
        ResponseHelper.success({
          ...report,
          evidence,
          updates,
        })
      );
    } catch (error) {
      console.error("Get report by ID error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch report"));
    }
  }

  static async getUserReports(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const result = await CorruptionReportModel.findAll({
        reporterId: req.user?.userId,
        limit: Number(limit),
        offset,
      });

      res.json(
        ResponseHelper.paginated(
          result.reports,
          result.total,
          Number(page),
          Number(limit)
        )
      );
    } catch (error) {
      console.error("Get user reports error:", error);
      res
        .status(500)
        .json(ResponseHelper.error("Failed to fetch user reports"));
    }
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status, updateMessage } = req.body;

      // Only admins and investigators can update status
      if (!["admin", "investigator"].includes(req.user.role)) {
        res.status(403).json(ResponseHelper.error("Insufficient permissions"));
        return;
      }

      const report = await CorruptionReportModel.updateStatus(
        id,
        status,
        req.user.userId
      );

      // Add update to timeline
      if (updateMessage) {
        await db("report_updates").insert({
          reportId: id,
          status,
          updateMessage,
          officerId: req.user.userId,
          isPublicVisible: true,
          createdAt: new Date(),
        });
      }

      res.json(ResponseHelper.success(report, "Report status updated"));
    } catch (error) {
      console.error("Update report status error:", error);
      res
        .status(500)
        .json(ResponseHelper.error("Failed to update report status"));
    }
  }

  static async uploadEvidence(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json(ResponseHelper.error("No files uploaded"));
        return;
      }

      const evidenceRecords = [];
      for (const file of files) {
        const evidence = {
          id: generateUUID(),
          reportId: id,
          fileName: file.originalname,
          fileType: file.mimetype.startsWith("image/") ? "photo" : "document",
          fileUrl: (file as any).path,
          fileSizeBytes: file.size,
          mimeType: file.mimetype,
          isVerified: false,
          uploadedAt: new Date(),
          metadata: {
            originalName: file.originalname,
            cloudinaryId: (file as any).public_id,
          },
        };

        evidenceRecords.push(evidence);
      }

      await db("report_evidence").insert(evidenceRecords);

      res.json(
        ResponseHelper.success(
          evidenceRecords,
          "Evidence uploaded successfully"
        )
      );
    } catch (error) {
      console.error("Upload evidence error:", error);
      res.status(500).json(ResponseHelper.error("Failed to upload evidence"));
    }
  }

  static async voteOnReport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { voteType } = req.body; // "upvote"or "downvote"

      // Check if the user is already present
      const existingVote = await db("user_interactions")
        .where({
          userId: req.user.userId,
          targetType: "report",
          targetId: id,
        })
        .whereIn("interaction", ["upvote", "downvote"])
        .first();

      if (existingVote) {
        if (existingVote.interactionType === voteType) {
          res.status(400).json(ResponseHelper.error("Already voted"));
          return;
        }

        // update existing vote
        await db("user_interactions")
          .where({ id: existingVote.id })
          .update({ interactionType: voteType });
      } else {
        // Create new vote
        await db("user_interactions").insert({
          userId: req.user.userId,
          targetType: "report",
          targetId: id,
          interactionType: voteType,
          createdAt: new Date(),
        });
      }

      // Update vote counts
      const votes = await db("user_interactions")
        .where({ targetType: "report", targetId: id })
        .whereIn("interactionType", ["upvote", "downVote"])
        .select("interactionType")
        .count("* as count")
        .groupBy("interactionType");

      const upvotes =
        votes.find((v) => v.interactionType === "upvote")?.count || 0;
      const downvotes =
        votes.find((v) => v.interactionType === "downvote")?.count || 0;

      await CorruptionReportModel.updateVotes(
        id,
        Number(upvotes),
        Number(downvotes)
      );

      res.json(ResponseHelper.success({ upvotes, downvotes }, "Vote recorded"));
    } catch (error) {
      console.error("Vote on report error:", error);
      res.status(500).json(ResponseHelper.error("Failed to record vote"));
    }
  }

  // Admin functions for report management
  static async approve(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { comment } = req.body;

      const report = await CorruptionReportModel.updateStatus(
        id,
        ReportStatus.VERIFIED,
        req.user.userId
      );

      // Add update to timeline
      if (comment) {
        await db("report_updates").insert({
          reportId: id,
          status: ReportStatus.VERIFIED,
          updateMessage: comment,
          officerId: req.user.userId,
          isPublicVisible: true,
          createdAt: new Date(),
        });
      }

      res.json(ResponseHelper.success(report, "Report approved successfully"));
    } catch (error) {
      console.error("Approve report error:", error);
      res.status(500).json(ResponseHelper.error("Failed to approve report"));
    }
  }

  static async reject(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { comment } = req.body;

      if (!comment) {
        res
          .status(400)
          .json(ResponseHelper.error("Rejection comment is required"));
        return;
      }

      const report = await CorruptionReportModel.updateStatus(
        id,
        ReportStatus.DISMISSED,
        req.user.userId
      );

      // Add update to timeline
      await db("report_updates").insert({
        reportId: id,
        status: ReportStatus.DISMISSED,
        updateMessage: comment,
        officerId: req.user.userId,
        isPublicVisible: true,
        createdAt: new Date(),
      });

      res.json(ResponseHelper.success(report, "Report rejected successfully"));
    } catch (error) {
      console.error("Reject report error:", error);
      res.status(500).json(ResponseHelper.error("Failed to reject report"));
    }
  }

  static async resolve(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { comment } = req.body;

      const report = await CorruptionReportModel.updateStatus(
        id,
        ReportStatus.RESOLVED,
        req.user.userId
      );

      // Add update to timeline
      if (comment) {
        await db("report_updates").insert({
          reportId: id,
          status: ReportStatus.RESOLVED,
          updateMessage: comment,
          officerId: req.user.userId,
          isPublicVisible: true,
          createdAt: new Date(),
        });
      }

      res.json(ResponseHelper.success(report, "Report resolved successfully"));
    } catch (error) {
      console.error("Resolve report error:", error);
      res.status(500).json(ResponseHelper.error("Failed to resolve report"));
    }
  }
}
