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
        .where({ status: "active" })
        .count("* as count")
        .first();

      // Recent Activity
      const recentReports = await db("corruption_reports")
        .select("*")
        .orderBy("createdAt", "desc")
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
      res
        .status(500)
        .json(ResponseHelper.error("Failed to fetch dashboard stats"));
    }
  }

  static async getMajorCases(req: Request, res: Response): Promise<void> {
    try {
      const majorCases = await db("corruption_reports")
        .select("*")
        .where("publicVisibility", "public")
        .where(function () {
          this.where("priority", "urgent")
            .orWhere("amountInvolved", ">", 1000000)
            .orWhere("upvotesCount", ">", 50);
        })
        .orderBy("createdBy", "desc")
        .limit(10);

      res.json(ResponseHelper.success(majorCases));
    } catch (error) {
      res.status(500).json(ResponseHelper.error("Failed to fetch major cases"));
    }
  }

  static async getLiveServices(req: Request, res: Response): Promise<void> {
    try {
      const { district, municipality } = req.query;

      let query = db("service_status")
        .select("*")
        .orderBy("lastUpdated", "desc");

      if (district) query = query.where("district", district);
      if (municipality) query = query.where("municipality", municipality);

      const services = await query;
      res.json(ResponseHelper.success(services));
    } catch (error) {
      res
        .status(500)
        .json(ResponseHelper.error("Failed to fetch service status"));
    }
  }
}
