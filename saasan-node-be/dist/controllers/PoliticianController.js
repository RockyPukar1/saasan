"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliticianController = void 0;
const ResponseHelper_1 = require("../lib/helpers/ResponseHelper");
const PoliticianModel_1 = require("../models/PoliticianModel");
const PoliticalPromiseModel_1 = require("../models/PoliticalPromiseModel");
const ValidationHelper_1 = require("../lib/helpers/ValidationHelper");
const utils_1 = require("../lib/utils");
const database_1 = __importDefault(require("../config/database"));
class PoliticianController {
    static async getAll(req, res) {
        try {
            const { district, municipality, partyId, positionId, status, page = 1, limit = 20, search, } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            let result;
            if (search) {
                const politicians = await PoliticianModel_1.PoliticianModel.searchByName(search, Number(limit));
                result = { politicians, total: politicians.length };
            }
            else {
                result = await PoliticianModel_1.PoliticianModel.findAll({
                    district: district,
                    municipality: municipality,
                    partyId: partyId ? Number(partyId) : undefined,
                    positionId: positionId ? Number(positionId) : undefined,
                    status: status,
                    limit: Number(limit),
                    offset,
                });
            }
            res.json(ResponseHelper_1.ResponseHelper.paginated(result.politicians, result.total, Number(page), Number(limit)));
        }
        catch (error) {
            console.error("Get all politicians error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch politicians"));
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const politician = await PoliticianModel_1.PoliticianModel.findById(id);
            if (!politician) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Politician not found"));
            }
            // Get performance metrics
            const metrics = await PoliticianModel_1.PoliticianModel.getPerformanceMetrics(id);
            res.json(ResponseHelper_1.ResponseHelper.success({
                ...politician,
                performanceMetrics: metrics,
            }));
        }
        catch (error) {
            console.error("Get politician by ID error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch politician"));
        }
    }
    static async getPromises(req, res) {
        try {
            const { id } = req.params;
            const promises = await PoliticalPromiseModel_1.PoliticalPromiseModel.findByPolitician(id);
            const stats = await PoliticalPromiseModel_1.PoliticalPromiseModel.getStatsByPolitician(id);
            res.json(ResponseHelper_1.ResponseHelper.success({
                promises,
                statistics: stats,
            }));
        }
        catch (error) {
            console.error("Get politician promises error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch promises"));
        }
    }
    static async getGovernmentLevels(req, res) {
        try {
            const levels = await PoliticianModel_1.PoliticianModel.getGovernmentLevels();
            res.json(ResponseHelper_1.ResponseHelper.success(levels));
        }
        catch (error) {
            console.error("Get government levels error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to fetch government levels"));
        }
    }
    static async getByLevel(req, res) {
        try {
            const { level } = req.params;
            const { district, municipality, partyId, positionId, status, page = 1, limit = 20, search, } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const result = await PoliticianModel_1.PoliticianModel.findByLevel(level, {
                district: district,
                municipality: municipality,
                partyId: partyId ? Number(partyId) : undefined,
                positionId: positionId ? Number(positionId) : undefined,
                status: status,
                limit: Number(limit),
                offset,
                search: search,
            });
            res.json(ResponseHelper_1.ResponseHelper.paginated(result.politicians, result.total, Number(page), Number(limit)));
        }
        catch (error) {
            console.error("Get politicians by level error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to fetch politicians by level"));
        }
    }
    static async ratePolitician(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = ValidationHelper_1.ValidationHelper.politicianRating.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            // Check if the user already rated this politician in this category
            const existingRating = await (0, database_1.default)("politician_ratings")
                .where({
                politicianId: id,
                userId: req.user.userId,
                category: value.category,
            })
                .first();
            if (existingRating) {
                // Update existing rating
                await (0, database_1.default)("politician_ratings").where({ id: existingRating.id }).update({
                    rating: value.rating,
                    comment: value.comment,
                    updatedAt: new Date(),
                });
            }
            else {
                // Create new rating
                await (0, database_1.default)("politician_ratings").insert({
                    politicianId: id,
                    userId: req.user.userId,
                    rating: value.rating,
                    category: value.category,
                    comment: value.comment,
                    isVerifiedVoter: true, // TODO: Implement constituency verification,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
            res.json(ResponseHelper_1.ResponseHelper.success(null, "Rating submitted successfully"));
        }
        catch (error) {
            console.error("Rate politician error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to submit rating"));
        }
    }
    static async create(req, res) {
        try {
            const { error, value } = ValidationHelper_1.ValidationHelper.politician.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            const id = (0, utils_1.generateUUID)();
            const politician = await (0, database_1.default)("politicians")
                .insert({
                id,
                ...value,
                created_at: new Date(),
                updated_at: new Date(),
            })
                .returning("*");
            res
                .status(201)
                .json(ResponseHelper_1.ResponseHelper.success(politician[0], "Politician created successfully"));
        }
        catch (error) {
            console.error("Create politician error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to create politician"));
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = ValidationHelper_1.ValidationHelper.politicianUpdate.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            const politician = await (0, database_1.default)("politicians")
                .where({ id })
                .update({
                ...value,
                updated_at: new Date(),
            })
                .returning("*");
            if (!politician.length) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Politician not found"));
                return;
            }
            res.json(ResponseHelper_1.ResponseHelper.success(politician[0], "Politician updated successfully"));
        }
        catch (error) {
            console.error("Update politician error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to update politician"));
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await (0, database_1.default)("politicians").where({ id }).del();
            if (!deleted) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Politician not found"));
                return;
            }
            res.json(ResponseHelper_1.ResponseHelper.success(null, "Politician deleted successfully"));
        }
        catch (error) {
            console.error("Delete politician error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to delete politician"));
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
            console.error("Bulk upload politicians error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to upload politicians"));
        }
    }
}
exports.PoliticianController = PoliticianController;
