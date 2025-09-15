"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliticalPromiseModel = void 0;
const database_1 = __importDefault(require("../config/database"));
const utils_1 = require("../lib/utils");
class PoliticalPromiseModel {
    static async create(promiseData) {
        const id = (0, utils_1.generateUUID)();
        const [promise] = await (0, database_1.default)("political_promises")
            .insert({
            ...promiseData,
            id,
            created_at: new Date(),
            updated_at: new Date(),
        })
            .returning("*");
        return promise;
    }
    static async findByPolitician(politicianId) {
        return (0, database_1.default)("political_promises")
            .where({ politician_id: politicianId })
            .orderBy("created_at", "desc");
    }
    static async getStatsByPolitician(politicianId) {
        const stats = await (0, database_1.default)("political_promises")
            .where({ politician_id: politicianId })
            .select("status")
            .count("* as count")
            .groupBy("status");
        const total = await (0, database_1.default)("political_promises")
            .where({ politician_id: politicianId })
            .count("* as total")
            .first();
        const completed = stats.find(s => s.status === 'completed')?.count || 0;
        const inProgress = stats.find(s => s.status === 'in_progress')?.count || 0;
        const notStarted = stats.find(s => s.status === 'not_started')?.count || 0;
        const failed = stats.find(s => s.status === 'failed')?.count || 0;
        return {
            total: parseInt(total?.total) || 0,
            completed: parseInt(completed) || 0,
            inProgress: parseInt(inProgress) || 0,
            notStarted: parseInt(notStarted) || 0,
            failed: parseInt(failed) || 0,
            completionRate: total?.total ? Math.round((parseInt(completed) / parseInt(total.total)) * 100) : 0
        };
    }
    static async update(id, updates) {
        const [promise] = await (0, database_1.default)("political_promises")
            .where({ id })
            .update({ ...updates, updated_at: new Date() })
            .returning("*");
        return promise;
    }
    static async delete(id) {
        const deletedCount = await (0, database_1.default)("political_promises").where({ id }).del();
        return deletedCount > 0;
    }
}
exports.PoliticalPromiseModel = PoliticalPromiseModel;
