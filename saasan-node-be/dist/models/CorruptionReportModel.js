"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorruptionReportModel = void 0;
const database_1 = __importDefault(require("../config/database"));
const types_1 = require("../types");
const utils_1 = require("../lib/utils");
class CorruptionReportModel {
    static async create(reportData) {
        const id = (0, utils_1.generateUUID)();
        const referenceNumber = await this.generateReferenceNumber();
        const [report] = await (0, database_1.default)("corruption_reports")
            .insert({
            ...reportData,
            id,
            reference_number: referenceNumber,
            upvotes_count: 0,
            downvotes_count: 0,
            views_count: 0,
            shares_count: 0,
            created_at: new Date(),
            updated_at: new Date(),
        })
            .returning("*");
        return report;
    }
    static async findById(id) {
        const report = await (0, database_1.default)("corruption_reports").where({ id }).first();
        return report || null;
    }
    static async findByReference(referenceNumber) {
        const report = await (0, database_1.default)("corruption_reports")
            .where({ reference_number: referenceNumber })
            .first();
        return report || null;
    }
    static async findAll(filters = {}) {
        let query = (0, database_1.default)("corruption_reports")
            .select("corruption_reports.*", "report_categories.name as categoryName")
            .leftJoin("report_categories", "corruption_reports.category_id", "report_categories.id");
        // Apply filters
        if (filters.status)
            query = query.where("corruption_reports.status", filters.status);
        if (filters.priority)
            query = query.where("corruption_reports.priority", filters.priority);
        if (filters.categoryId)
            query = query.where("corruption_reports.category_id", filters.categoryId);
        if (filters.district)
            query = query.where("corruption_reports.district", filters.district);
        if (filters.municipality)
            query = query.where("corruption_reports.municipality", filters.municipality);
        if (filters.assignedToOfficerId)
            query = query.where("corruption_reports.assigned_to_officer_id", filters.assignedToOfficerId);
        if (filters.reporterId)
            query = query.where("corruption_reports.reporter_id", filters.reporterId);
        if (filters.publicVisibility)
            query = query.where("corruption_reports.is_public", filters.publicVisibility === "true");
        const total = await query.clone().count("* as count").first();
        // Sorting
        const sortBy = filters.sortBy || "created_at";
        const sortOrder = filters.sortOrder || "desc";
        query = query.orderBy(`corruption_reports.${sortBy}`, sortOrder);
        // Pagination
        if (filters.limit)
            query = query.limit(filters.limit);
        if (filters.offset)
            query = query.offset(filters.offset);
        const reports = await query;
        return {
            reports,
            total: parseInt(total?.count),
        };
    }
    static async updateStatus(id, status, officerId) {
        const updateData = {
            status,
            updated_at: new Date(),
        };
        if (status === types_1.ReportStatus.RESOLVED) {
            updateData.resolved_at = new Date();
        }
        if (officerId) {
            updateData.assigned_to_officer_id = officerId;
        }
        const [report] = await (0, database_1.default)("corruption_reports")
            .where({ id })
            .update(updateData)
            .returning("*");
        return report;
    }
    static async incrementViews(id) {
        await (0, database_1.default)("corruption_reports").where({ id }).increment("views_count", 1);
    }
    static async updateVotes(id, upvotes, downvotes) {
        await (0, database_1.default)("corruption_reports").where({ id }).update({
            upvotes_count: upvotes,
            downvotes_count: downvotes,
        });
    }
    static async generateReferenceNumber() {
        const year = new Date().getFullYear();
        const count = await (0, database_1.default)("corruption_reports")
            .whereRaw("EXTRACT(YEAR FROM created_at) = ?", [year])
            .count("* as count")
            .first();
        const nextNumber = (parseInt(count?.count) || 0) + 1;
        return `CR-${year}-${nextNumber.toString().padStart(6, "0")}`;
    }
    static async getStatsByDistrict() {
        return (0, database_1.default)("corruption_reports")
            .select("district")
            .count("* as totalReports")
            .countDistinct("corruption_reports.id", { as: "uniqueReports" })
            .avg("amount_involved as avgAmount")
            .groupBy("district")
            .orderBy("totalReports", "desc");
    }
    static async getStatsByCategory() {
        return (0, database_1.default)("corruption_reports")
            .select("report_categories.name as categoryName")
            .count("* as count")
            .leftJoin("report_categories", "corruption_reports.category_id", "report_categories.id")
            .groupBy("report_categories.name")
            .orderBy("count", "desc");
    }
}
exports.CorruptionReportModel = CorruptionReportModel;
