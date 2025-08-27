import { Request, Response } from "express";
import db from "../config/database";
import { CorruptionReportModel } from "../models/CorruptionReportModel";
import { ResponseHelper } from "../lib/helpers/ResponseHelper";

export class DashboardController {
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      // Overall statistics
      const totalReports = await db("corruption_reports")
        .count("* as count")
        .first();
      const resolvedReports = await db("corruption_reports")
        .where({
          status: "resolved",
        })
        .count("* as count")
        .first();
      const totalPoliticians = await db("politicians")
        .count("* as count")
        .first();
      const activePoliticians = await db("politicians")
        .where({ is_active: true })
        .count("* as count")
        .first();

      // Recent Activity
      const recentReports = await db("corruption_reports")
        .select("*")
        .orderBy("created_at", "desc")
        .limit(5);

      // Statistics by category
      const categoryStats = await CorruptionReportModel.getStatsByCategory();

      // Statistics by district
      const districtStats = await CorruptionReportModel.getStatsByDistrict();

      const stats = {
        overview: {
          totalReports: Number(totalReports?.count) || 0,
          resolvedReports: Number(resolvedReports?.count) || 0,
          totalPoliticians: Number(totalPoliticians?.count) || 0,
          activePoliticians: Number(activePoliticians?.count) || 0,
          resolutionRate: totalReports?.count
            ? (
                (Number(resolvedReports?.count) / Number(totalReports?.count)) *
                100
              ).toFixed(1)
            : 0,
        },
        recentActivity: recentReports,
        categoryBreakdown: categoryStats,
        districtBreakdown: districtStats,
      };

      res.json(ResponseHelper.success(stats));
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res
        .status(500)
        .json(ResponseHelper.error("Failed to fetch dashboard stats"));
    }
  }

  static async getMajorCases(req: Request, res: Response): Promise<void> {
    try {
      const majorCases = await db("corruption_reports")
        .select("*")
        .where("is_public", true)
        .where(function () {
          this.where("priority", "urgent")
            .orWhere("amount_involved", ">", 1000000)
            .orWhere("upvotes_count", ">", 50);
        })
        .orderBy("created_at", "desc")
        .limit(10);

      res.json(ResponseHelper.success(majorCases));
    } catch (error) {
      console.error("Major cases error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch major cases"));
    }
  }

  static async getLiveServices(req: Request, res: Response): Promise<void> {
    try {
      const { district, municipality } = req.query;

      let query = db("service_status")
        .select("*")
        .orderBy("last_updated", "desc");

      if (district) query = query.where("district", district);
      if (municipality) query = query.where("municipality", municipality);

      const services = await query;
      res.json(ResponseHelper.success(services));
    } catch (error) {
      console.error("Live services error:", error);
      res
        .status(500)
        .json(ResponseHelper.error("Failed to fetch service status"));
    }
  }
}
