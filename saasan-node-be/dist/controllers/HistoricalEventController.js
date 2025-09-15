"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricalEventController = void 0;
const ResponseHelper_1 = require("../lib/helpers/ResponseHelper");
const ValidationHelper_1 = require("../lib/helpers/ValidationHelper");
const database_1 = __importDefault(require("../config/database"));
const utils_1 = require("../lib/utils");
class HistoricalEventController {
    static async getAll(req, res) {
        try {
            const { year, category, page = 1, limit = 20, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            let query = (0, database_1.default)("historical_events").select("*");
            // Apply filters
            if (year)
                query = query.where("year", year);
            if (category)
                query = query.where("category", category);
            if (search) {
                query = query.where(function () {
                    this.where("title", "ilike", `%${search}%`).orWhere("description", "ilike", `%${search}%`);
                });
            }
            const total = await (0, database_1.default)("historical_events")
                .modify((queryBuilder) => {
                if (year)
                    queryBuilder.where("year", year);
                if (category)
                    queryBuilder.where("category", category);
                if (search) {
                    queryBuilder.where(function () {
                        this.where("title", "ilike", `%${search}%`).orWhere("description", "ilike", `%${search}%`);
                    });
                }
            })
                .count("* as count")
                .first();
            // Sorting and pagination
            query = query.orderBy("date", "desc");
            if (limit)
                query = query.limit(Number(limit));
            if (offset)
                query = query.offset(offset);
            const events = await query;
            res.json(ResponseHelper_1.ResponseHelper.paginated(events, Number(total?.count) || 0, Number(page), Number(limit)));
        }
        catch (error) {
            console.error("Get historical events error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to fetch historical events"));
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const event = await (0, database_1.default)("historical_events").where({ id }).first();
            if (!event) {
                res
                    .status(404)
                    .json(ResponseHelper_1.ResponseHelper.error("Historical event not found"));
                return;
            }
            res.json(ResponseHelper_1.ResponseHelper.success(event));
        }
        catch (error) {
            console.error("Get historical event by ID error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to fetch historical event"));
        }
    }
    static async create(req, res) {
        try {
            const { error, value } = ValidationHelper_1.ValidationHelper.historicalEvent.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            const id = (0, utils_1.generateUUID)();
            const event = await (0, database_1.default)("historical_events")
                .insert({
                id,
                ...value,
                created_at: new Date(),
                updated_at: new Date(),
            })
                .returning("*");
            res
                .status(201)
                .json(ResponseHelper_1.ResponseHelper.success(event[0], "Historical event created successfully"));
        }
        catch (error) {
            console.error("Create historical event error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to create historical event"));
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = ValidationHelper_1.ValidationHelper.historicalEventUpdate.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            const event = await (0, database_1.default)("historical_events")
                .where({ id })
                .update({
                ...value,
                updated_at: new Date(),
            })
                .returning("*");
            if (!event.length) {
                res
                    .status(404)
                    .json(ResponseHelper_1.ResponseHelper.error("Historical event not found"));
                return;
            }
            res.json(ResponseHelper_1.ResponseHelper.success(event[0], "Historical event updated successfully"));
        }
        catch (error) {
            console.error("Update historical event error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to update historical event"));
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await (0, database_1.default)("historical_events").where({ id }).del();
            if (!deleted) {
                res
                    .status(404)
                    .json(ResponseHelper_1.ResponseHelper.error("Historical event not found"));
                return;
            }
            res.json(ResponseHelper_1.ResponseHelper.success(null, "Historical event deleted successfully"));
        }
        catch (error) {
            console.error("Delete historical event error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to delete historical event"));
        }
    }
    static async bulkUpload(req, res) {
        try {
            // This would typically handle CSV file upload and parsing
            // For now, we'll return a mock response
            res.json(ResponseHelper_1.ResponseHelper.success({
                imported: 0,
                skipped: 0,
                errors: ["CSV upload functionality not implemented yet"],
            }, "Bulk upload completed"));
        }
        catch (error) {
            console.error("Bulk upload historical events error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to upload historical events"));
        }
    }
}
exports.HistoricalEventController = HistoricalEventController;
