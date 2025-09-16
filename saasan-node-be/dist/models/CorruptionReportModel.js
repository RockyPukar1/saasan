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
            query = query.where("corruption_reports.is_public", filters.publicVisibility === "public" || filters.publicVisibility === "true");
        const total = await (0, database_1.default)("corruption_reports")
            .count("* as count")
            .where((builder) => {
            if (filters.status)
                builder.where("status", filters.status);
            if (filters.priority)
                builder.where("priority", filters.priority);
            if (filters.categoryId)
                builder.where("category_id", filters.categoryId);
            if (filters.district)
                builder.where("district", filters.district);
            if (filters.municipality)
                builder.where("municipality", filters.municipality);
            if (filters.assignedToOfficerId)
                builder.where("assigned_to_officer_id", filters.assignedToOfficerId);
            if (filters.reporterId)
                builder.where("reporter_id", filters.reporterId);
            if (filters.publicVisibility)
                builder.where("is_public", filters.publicVisibility === "public" || filters.publicVisibility === "true");
        })
            .first();
        // Sorting
        const sortBy = filters.sortBy || "created_at";
        const sortOrder = filters.sortOrder || "desc";
        // Convert camelCase to snake_case for database columns
        const dbSortBy = sortBy === "createdAt" ? "created_at" :
            sortBy === "updatedAt" ? "updated_at" :
                sortBy === "referenceNumber" ? "reference_number" :
                    sortBy === "amountInvolved" ? "amount_involved" :
                        sortBy === "upvotesCount" ? "upvotes_count" :
                            sortBy === "downvotesCount" ? "downvotes_count" :
                                sortBy === "viewsCount" ? "views_count" :
                                    sortBy === "sharesCount" ? "shares_count" :
                                        sortBy === "peopleAffectedCount" ? "people_affected_count" :
                                            sortBy === "assignedToOfficerId" ? "assigned_to_officer_id" :
                                                sortBy === "reporterId" ? "reporter_id" :
                                                    sortBy === "categoryId" ? "category_id" :
                                                        sortBy === "dateOccurred" ? "date_occurred" :
                                                            sortBy === "resolvedAt" ? "resolved_at" :
                                                                sortBy === "isAnonymous" ? "is_anonymous" :
                                                                    sortBy === "isPublic" ? "is_public" :
                                                                        sortBy === "publicVisibility" ? "public_visibility" :
                                                                            sortBy;
        query = query.orderBy(`corruption_reports.${dbSortBy}`, sortOrder);
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
