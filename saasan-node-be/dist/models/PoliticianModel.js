"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliticianModel = void 0;
const database_1 = __importDefault(require("../config/database"));
const utils_1 = require("../lib/utils");
const types_1 = require("../types");
class PoliticianModel {
    static async create(politicianData) {
        const id = (0, utils_1.generateUUID)();
        const [politician] = await (0, database_1.default)("politicians")
            .insert({
            ...politicianData,
            id,
            created_at: new Date(),
            updated_at: new Date(),
        })
            .returning("*");
        return politician;
    }
    static async findById(id) {
        const politician = await (0, database_1.default)("politicians").where({ id }).first();
        return politician || null;
    }
    static async findAll(filters = {}) {
        let query = (0, database_1.default)("politicians")
            .select("politicians.*", "positions.title as positionTitle", "political_parties.name as partyName")
            .leftJoin("positions", "politicians.position_id", "positions.id")
            .leftJoin("political_parties", "politicians.party_id", "political_parties.id");
        if (filters.district)
            query = query.where("politicians.district", filters.district);
        if (filters.municipality)
            query = query.where("politicians.municipality", filters.municipality);
        if (filters.partyId)
            query = query.where("politicians.party_id", filters.partyId);
        if (filters.positionId)
            query = query.where("politicians.position_id", filters.positionId);
        if (filters.status)
            query = query.where("politicians.is_active", filters.status === types_1.PoliticianStatus.ACTIVE);
        const total = await (0, database_1.default)("politicians")
            .leftJoin("positions", "politicians.position_id", "positions.id")
            .leftJoin("political_parties", "politicians.party_id", "political_parties.id")
            .modify((queryBuilder) => {
            if (filters.district)
                queryBuilder.where("politicians.district", filters.district);
            if (filters.municipality)
                queryBuilder.where("politicians.municipality", filters.municipality);
            if (filters.partyId)
                queryBuilder.where("politicians.party_id", filters.partyId);
            if (filters.positionId)
                queryBuilder.where("politicians.position_id", filters.positionId);
            if (filters.status) {
                queryBuilder.where("politicians.is_active", filters.status === types_1.PoliticianStatus.ACTIVE);
            }
        })
            .count("* as count")
            .first();
        if (filters.limit)
            query = query.limit(filters.limit);
        if (filters.offset)
            query = query.offset(filters.offset);
        const politicians = await query;
        return {
            politicians,
            total: parseInt(total?.count) || 0,
        };
    }
    static async findByLevel(level, filters = {}) {
        // Normalize level name to match database values
        const levelMapping = {
            federal: "Federal",
            provincial: "Provincial",
            district: "District",
            municipal: "Municipal",
            ward: "Ward",
        };
        const normalizedLevel = levelMapping[level.toLowerCase()] || level;
        // Build base query for filtering
        let baseQuery = (0, database_1.default)("politicians")
            .leftJoin("positions", "politicians.position_id", "positions.id")
            .leftJoin("political_parties", "politicians.party_id", "political_parties.id")
            .leftJoin("constituencies", "politicians.constituency_id", "constituencies.id")
            .leftJoin("levels", "positions.level_id", "levels.id")
            .where("levels.name", "ilike", `%${normalizedLevel}%`);
        // Apply filters to base query
        if (filters.district)
            baseQuery = baseQuery.where("politicians.district", filters.district);
        if (filters.municipality)
            baseQuery = baseQuery.where("politicians.municipality", filters.municipality);
        if (filters.partyId)
            baseQuery = baseQuery.where("politicians.party_id", filters.partyId);
        if (filters.positionId)
            baseQuery = baseQuery.where("politicians.position_id", filters.positionId);
        if (filters.status)
            baseQuery = baseQuery.where("politicians.is_active", filters.status === types_1.PoliticianStatus.ACTIVE);
        if (filters.search)
            baseQuery = baseQuery.where("politicians.full_name", "ilike", `%${filters.search}%`);
        // Get total count first
        const totalResult = await baseQuery
            .clone()
            .count("politicians.id as count")
            .first();
        const total = parseInt(totalResult?.count) || 0;
        // Build main query for data
        let mainQuery = baseQuery.select("politicians.*", "positions.title as positionTitle", "political_parties.name as partyName", "constituencies.name as constituencyName", "levels.name as levelName");
        // Apply pagination
        if (filters.limit)
            mainQuery = mainQuery.limit(filters.limit);
        if (filters.offset)
            mainQuery = mainQuery.offset(filters.offset);
        const politicians = await mainQuery;
        return {
            politicians,
            total,
        };
    }
    static async getGovernmentLevels() {
        const levels = await (0, database_1.default)("levels")
            .select("levels.id", "levels.name", "levels.description")
            .orderBy("levels.id");
        // Get counts for each level separately to avoid GROUP BY issues
        const levelCounts = await (0, database_1.default)("levels")
            .select("levels.id", database_1.default.raw("COUNT(DISTINCT politicians.id) as count"))
            .leftJoin("positions", "levels.id", "positions.level_id")
            .leftJoin("politicians", "positions.id", "politicians.position_id")
            .where("politicians.is_active", true)
            .groupBy("levels.id");
        // Merge the data
        return levels.map((level) => {
            const countData = levelCounts.find((lc) => lc.id === level.id);
            return {
                id: level.id.toString(),
                name: level.name,
                description: level.description,
                count: parseInt(countData?.count) || 0,
            };
        });
    }
    static async searchByName(searchTerm, limit = 10) {
        return (0, database_1.default)("politicians")
            .select("politicians.*", "positions.title as positionTitle", "political_parties.name as partyName", "constituencies.name as constituencyName")
            .leftJoin("positions", "politicians.position_id", "positions.id")
            .leftJoin("political_parties", "politicians.party_id", "political_parties.id")
            .leftJoin("constituencies", "politicians.constituency_id", "constituencies.id")
            .where("full_name", "ilike", `%${searchTerm}%`)
            .limit(limit);
    }
    static async update(id, updates) {
        const [politician] = await (0, database_1.default)("politicians")
            .where({ id })
            .update({ ...updates, updated_at: new Date() })
            .returning("*");
        return politician;
    }
    static async getPerformanceMetrics(id) {
        const promises = await (0, database_1.default)("political_promises")
            .where({ politician_id: id })
            .select("status")
            .count("* as count")
            .groupBy("status");
        const ratings = await (0, database_1.default)("politician_ratings")
            .where({ politician_id: id })
            .avg("rating as averageRating")
            .count("* as totalRatings")
            .first();
        return { promises, ratings };
    }
}
exports.PoliticianModel = PoliticianModel;
