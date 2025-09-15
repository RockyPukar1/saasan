"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MajorCaseController = void 0;
const ResponseHelper_1 = require("../lib/helpers/ResponseHelper");
const ValidationHelper_1 = require("../lib/helpers/ValidationHelper");
const database_1 = __importDefault(require("../config/database"));
const utils_1 = require("../lib/utils");
class MajorCaseController {
    static async getAll(req, res) {
        try {
            const { status, priority, page = 1, limit = 20, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            let query = (0, database_1.default)("major_cases").select("*");
            // Apply filters
            if (status)
                query = query.where("status", status);
            if (priority)
                query = query.where("priority", priority);
            if (search) {
                query = query.where(function () {
                    this.where("title", "ilike", `%${search}%`)
                        .orWhere("description", "ilike", `%${search}%`)
                        .orWhere("reference_number", "ilike", `%${search}%`);
                });
            }
            const total = await (0, database_1.default)("major_cases")
                .modify((queryBuilder) => {
                if (status)
                    queryBuilder.where("status", status);
                if (priority)
                    queryBuilder.where("priority", priority);
                if (search) {
                    queryBuilder.where(function () {
                        this.where("title", "ilike", `%${search}%`).orWhere("description", "ilike", `%${search}%`);
                    });
                }
            })
                .count("* as count")
                .first();
            // Sorting and pagination
            query = query.orderBy("created_at", "desc");
            if (limit)
                query = query.limit(Number(limit));
            if (offset)
                query = query.offset(offset);
            const cases = await query;
            res.json(ResponseHelper_1.ResponseHelper.paginated(cases, Number(total?.count) || 0, Number(page), Number(limit)));
        }
        catch (error) {
            console.error("Get major cases error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch major cases"));
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const case_ = await (0, database_1.default)("major_cases").where({ id }).first();
            if (!case_) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Major case not found"));
                return;
            }
            res.json(ResponseHelper_1.ResponseHelper.success(case_));
        }
        catch (error) {
            console.error("Get major case by ID error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch major case"));
        }
    }
    static async create(req, res) {
        try {
            const { error, value } = ValidationHelper_1.ValidationHelper.majorCase.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            const id = (0, utils_1.generateUUID)();
            const case_ = await (0, database_1.default)("major_cases")
                .insert({
                id,
                ...value,
                created_at: new Date(),
                updated_at: new Date(),
            })
                .returning("*");
            res
                .status(201)
                .json(ResponseHelper_1.ResponseHelper.success(case_[0], "Major case created successfully"));
        }
        catch (error) {
            console.error("Create major case error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to create major case"));
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = ValidationHelper_1.ValidationHelper.majorCaseUpdate.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            const case_ = await (0, database_1.default)("major_cases")
                .where({ id })
                .update({
                ...value,
                updated_at: new Date(),
            })
                .returning("*");
            if (!case_.length) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Major case not found"));
                return;
            }
            res.json(ResponseHelper_1.ResponseHelper.success(case_[0], "Major case updated successfully"));
        }
        catch (error) {
            console.error("Update major case error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to update major case"));
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await (0, database_1.default)("major_cases").where({ id }).del();
            if (!deleted) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Major case not found"));
                return;
            }
            res.json(ResponseHelper_1.ResponseHelper.success(null, "Major case deleted successfully"));
        }
        catch (error) {
            console.error("Delete major case error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to delete major case"));
        }
    }
    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            if (!status || !["unsolved", "ongoing", "solved"].includes(status)) {
                res.status(400).json(ResponseHelper_1.ResponseHelper.error("Invalid status"));
                return;
            }
            const case_ = await (0, database_1.default)("major_cases")
                .where({ id })
                .update({
                status,
                updated_at: new Date(),
            })
                .returning("*");
            if (!case_.length) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Major case not found"));
                return;
            }
            res.json(ResponseHelper_1.ResponseHelper.success(case_[0], "Case status updated successfully"));
        }
        catch (error) {
            console.error("Update major case status error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to update case status"));
        }
    }
}
exports.MajorCaseController = MajorCaseController;
