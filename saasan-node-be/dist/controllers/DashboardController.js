"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const database_1 = __importDefault(require("../config/database"));
const CorruptionReportModel_1 = require("../models/CorruptionReportModel");
const ResponseHelper_1 = require("../lib/helpers/ResponseHelper");
class DashboardController {
    static async getStats(req, res) {
        try {
            // Overall statistics
            const totalReports = await (0, database_1.default)("corruption_reports")
                .count("* as count")
                .first();
            const resolvedReports = await (0, database_1.default)("corruption_reports")
                .where({
                status: "resolved",
            })
                .count("* as count")
                .first();
            const totalPoliticians = await (0, database_1.default)("politicians")
                .count("* as count")
                .first();
            const activePoliticians = await (0, database_1.default)("politicians")
                .where({ is_active: true })
                .count("* as count")
                .first();
            // Recent Activity
            const recentReports = await (0, database_1.default)("corruption_reports")
                .select("*")
                .orderBy("created_at", "desc")
                .limit(5);
            // Statistics by category
            const categoryStats = await CorruptionReportModel_1.CorruptionReportModel.getStatsByCategory();
            // Statistics by district
            const districtStats = await CorruptionReportModel_1.CorruptionReportModel.getStatsByDistrict();
            const stats = {
                overview: {
                    totalReports: Number(totalReports?.count) || 0,
                    resolvedReports: Number(resolvedReports?.count) || 0,
                    totalPoliticians: Number(totalPoliticians?.count) || 0,
                    activePoliticians: Number(activePoliticians?.count) || 0,
                    resolutionRate: totalReports?.count
                        ? ((Number(resolvedReports?.count) / Number(totalReports?.count)) *
                            100).toFixed(1)
                        : 0,
                },
                recentActivity: recentReports,
                categoryBreakdown: categoryStats,
                districtBreakdown: districtStats,
            };
            res.json(ResponseHelper_1.ResponseHelper.success(stats));
        }
        catch (error) {
            console.error("Dashboard stats error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to fetch dashboard stats"));
        }
    }
    static async getMajorCases(req, res) {
        try {
            const majorCases = await (0, database_1.default)("corruption_reports")
                .select("*")
                .where("is_public", true)
                .where(function () {
                this.where("priority", "urgent")
                    .orWhere("amount_involved", ">", 1000000)
                    .orWhere("upvotes_count", ">", 50);
            })
                .orderBy("created_at", "desc")
                .limit(10);
            res.json(ResponseHelper_1.ResponseHelper.success(majorCases));
        }
        catch (error) {
            console.error("Major cases error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch major cases"));
        }
    }
    static async getLiveServices(req, res) {
        try {
            const { district, municipality } = req.query;
            let query = (0, database_1.default)("service_status")
                .select("*")
                .orderBy("last_updated", "desc");
            if (district)
                query = query.where("district", district);
            if (municipality)
                query = query.where("municipality", municipality);
            const services = await query;
            res.json(ResponseHelper_1.ResponseHelper.success(services));
        }
        catch (error) {
            console.error("Live services error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to fetch service status"));
        }
    }
}
exports.DashboardController = DashboardController;
