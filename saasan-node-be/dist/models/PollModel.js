"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollModel = void 0;
const database_1 = __importDefault(require("../config/database"));
const utils_1 = require("../lib/utils");
class PollModel {
    static async create(pollData) {
        const id = (0, utils_1.generateUUID)();
        const [poll] = await (0, database_1.default)("polls")
            .insert({
            ...pollData,
            id,
            created_at: new Date(),
            updated_at: new Date(),
        })
            .returning("*");
        return poll;
    }
    static async findById(id) {
        const poll = await (0, database_1.default)("polls").where({ id }).first();
        if (!poll)
            return null;
        // Get poll options
        const options = await (0, database_1.default)("poll_options")
            .where({ poll_id: id })
            .orderBy("created_at", "asc");
        return {
            ...poll,
            options,
        };
    }
    static async findAll(filters = {}) {
        // Build base query for filtering
        let baseQuery = (0, database_1.default)("polls");
        if (filters.search) {
            baseQuery = baseQuery.where("title", "ilike", `%${filters.search}%`);
        }
        // Get total count first
        const totalResult = await baseQuery.clone().count("id as count").first();
        const total = parseInt(totalResult?.count) || 0;
        // Build main query for data
        let mainQuery = baseQuery.select("*").orderBy("created_at", "desc");
        // Apply pagination
        if (filters.limit)
            mainQuery = mainQuery.limit(filters.limit);
        if (filters.offset)
            mainQuery = mainQuery.offset(filters.offset);
        const polls = await mainQuery;
        // Get options for each poll
        const pollsWithOptions = await Promise.all(polls.map(async (poll) => {
            const options = await (0, database_1.default)("poll_options")
                .where({ poll_id: poll.id })
                .orderBy("created_at", "asc");
            return { ...poll, options };
        }));
        return {
            polls: pollsWithOptions,
            total,
        };
    }
    static async update(id, updates) {
        const [poll] = await (0, database_1.default)("polls")
            .where({ id })
            .update({ ...updates, updated_at: new Date() })
            .returning("*");
        return poll;
    }
    static async delete(id) {
        // Delete poll options first
        await (0, database_1.default)("poll_options").where({ poll_id: id }).del();
        // Delete the poll
        const deletedCount = await (0, database_1.default)("polls").where({ id }).del();
        return deletedCount > 0;
    }
    static async addOption(pollId, optionText) {
        const id = (0, utils_1.generateUUID)();
        const [option] = await (0, database_1.default)("poll_options")
            .insert({
            id,
            poll_id: pollId,
            option: optionText,
            votes: 0,
            created_at: new Date(),
            updated_at: new Date(),
        })
            .returning("*");
        return option;
    }
    static async vote(pollId, optionId, userId) {
        // Check if user already voted on this poll
        const existingVote = await (0, database_1.default)("poll_votes")
            .where({ poll_id: pollId, user_id: userId })
            .first();
        if (existingVote) {
            // Update existing vote
            await (0, database_1.default)("poll_votes")
                .where({ id: existingVote.id })
                .update({ option_id: optionId, updated_at: new Date() });
        }
        else {
            // Create new vote
            await (0, database_1.default)("poll_votes").insert({
                poll_id: pollId,
                user_id: userId,
                option_id: optionId,
                created_at: new Date(),
                updated_at: new Date(),
            });
        }
        // Update vote counts for all options
        await this.updateVoteCounts(pollId);
        return true;
    }
    static async updateVoteCounts(pollId) {
        const voteCounts = await (0, database_1.default)("poll_votes")
            .where({ poll_id: pollId })
            .select("option_id")
            .count("* as count")
            .groupBy("option_id");
        // Reset all options to 0 votes
        await (0, database_1.default)("poll_options").where({ poll_id: pollId }).update({ votes: 0 });
        // Update vote counts
        for (const voteCount of voteCounts) {
            await (0, database_1.default)("poll_options")
                .where({ id: voteCount.option_id })
                .update({ votes: parseInt(voteCount.count) });
        }
    }
    static async getPollStats(pollId) {
        const totalVotes = await (0, database_1.default)("poll_votes")
            .where({ poll_id: pollId })
            .count("* as count")
            .first();
        const optionStats = await (0, database_1.default)("poll_options")
            .where({ poll_id: pollId })
            .select("id", "option", "votes")
            .orderBy("votes", "desc");
        return {
            totalVotes: parseInt(totalVotes?.count) || 0,
            options: optionStats,
        };
    }
    static async searchByTitle(searchTerm, limit = 10) {
        const polls = await (0, database_1.default)("polls")
            .where("title", "ilike", `%${searchTerm}%`)
            .limit(limit)
            .orderBy("created_at", "desc");
        // Get options for each poll
        const pollsWithOptions = await Promise.all(polls.map(async (poll) => {
            const options = await (0, database_1.default)("poll_options")
                .where({ poll_id: poll.id })
                .orderBy("created_at", "asc");
            return { ...poll, options };
        }));
        return pollsWithOptions;
    }
    static async getAnalytics() {
        // Get total polls count
        const totalPollsResult = await (0, database_1.default)("polls").count("id as count").first();
        const totalPolls = parseInt(totalPollsResult?.count) || 0;
        // Get active polls count
        const activePollsResult = await (0, database_1.default)("polls")
            .where("status", "active")
            .count("id as count")
            .first();
        const activePolls = parseInt(activePollsResult?.count) || 0;
        // Get total votes count
        const totalVotesResult = await (0, database_1.default)("poll_votes")
            .count("id as count")
            .first();
        const totalVotes = parseInt(totalVotesResult?.count) || 0;
        // Calculate participation rate (simplified)
        const participationRate = totalPolls > 0 ? Math.round((totalVotes / (totalPolls * 10)) * 100) : 0;
        // Get category breakdown
        const categoryBreakdown = await (0, database_1.default)("polls")
            .select("category")
            .count("id as count")
            .groupBy("category")
            .orderBy("count", "desc");
        const categoryData = categoryBreakdown.map((item) => ({
            category: item.category,
            count: parseInt(item.count),
            percentage: totalPolls > 0
                ? Math.round((parseInt(item.count) / totalPolls) * 100)
                : 0,
        }));
        // Get district breakdown
        const districtBreakdown = await (0, database_1.default)("polls")
            .select("district")
            .count("id as count")
            .whereNotNull("district")
            .groupBy("district")
            .orderBy("count", "desc");
        const districtData = districtBreakdown.map((item) => ({
            district: item.district,
            count: parseInt(item.count),
            percentage: totalPolls > 0
                ? Math.round((parseInt(item.count) / totalPolls) * 100)
                : 0,
        }));
        // Get politician performance (mock data for now)
        const politicianPerformance = await (0, database_1.default)("polls")
            .leftJoin("politicians", "polls.politician_id", "politicians.id")
            .select("politicians.id as politician_id", "politicians.full_name as politician_name")
            .count("polls.id as polls_created")
            .whereNotNull("polls.politician_id")
            .groupBy("politicians.id", "politicians.full_name")
            .orderBy("polls_created", "desc")
            .limit(10);
        const politicianData = politicianPerformance.map((item) => ({
            politician_id: item.politician_id,
            politician_name: item.politician_name,
            polls_created: parseInt(item.polls_created),
            total_votes_received: Math.floor(Math.random() * 1000), // Mock data
            average_rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Mock data: 3-5 rating
        }));
        // Get party performance (mock data for now)
        const partyPerformance = await (0, database_1.default)("polls")
            .leftJoin("political_parties", "polls.party_id", "political_parties.id")
            .select("political_parties.id as party_id", "political_parties.name as party_name")
            .count("polls.id as polls_created")
            .whereNotNull("polls.party_id")
            .groupBy("political_parties.id", "political_parties.name")
            .orderBy("polls_created", "desc")
            .limit(10);
        const partyData = partyPerformance.map((item) => ({
            party_id: item.party_id,
            party_name: item.party_name,
            polls_created: parseInt(item.polls_created),
            total_votes_received: Math.floor(Math.random() * 2000), // Mock data
            average_rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Mock data: 3-5 rating
        }));
        return {
            total_polls: totalPolls,
            active_polls: activePolls,
            total_votes: totalVotes,
            participation_rate: participationRate,
            category_breakdown: categoryData,
            district_breakdown: districtData,
            politician_performance: politicianData,
            party_performance: partyData,
        };
    }
    static async getCategories() {
        const categories = await (0, database_1.default)("polls")
            .select("category")
            .distinct()
            .whereNotNull("category")
            .orderBy("category");
        return categories.map((item) => item.category);
    }
    static async getPoliticianComparison(politicianId) {
        // Get polls related to this politician
        const polls = await (0, database_1.default)("polls")
            .where("politician_id", politicianId)
            .select("*");
        // Mock comparison data for now
        return polls.map((poll) => ({
            poll_id: poll.id,
            poll_title: poll.title,
            politician_comparison: [
                {
                    politician_id: politicianId,
                    politician_name: "Current Politician",
                    votes_received: Math.floor(Math.random() * 500),
                    percentage: Math.floor(Math.random() * 100),
                },
            ],
            party_comparison: [
                {
                    party_id: "1",
                    party_name: "Party A",
                    votes_received: Math.floor(Math.random() * 300),
                    percentage: Math.floor(Math.random() * 50),
                },
                {
                    party_id: "2",
                    party_name: "Party B",
                    votes_received: Math.floor(Math.random() * 200),
                    percentage: Math.floor(Math.random() * 30),
                },
            ],
        }));
    }
    static async getPartyComparison(partyId) {
        // Get polls related to this party
        const polls = await (0, database_1.default)("polls").where("party_id", partyId).select("*");
        // Mock comparison data for now
        return polls.map((poll) => ({
            poll_id: poll.id,
            poll_title: poll.title,
            politician_comparison: [
                {
                    politician_id: "1",
                    politician_name: "Politician A",
                    votes_received: Math.floor(Math.random() * 400),
                    percentage: Math.floor(Math.random() * 60),
                },
                {
                    politician_id: "2",
                    politician_name: "Politician B",
                    votes_received: Math.floor(Math.random() * 300),
                    percentage: Math.floor(Math.random() * 40),
                },
            ],
            party_comparison: [
                {
                    party_id: partyId,
                    party_name: "Current Party",
                    votes_received: Math.floor(Math.random() * 600),
                    percentage: Math.floor(Math.random() * 100),
                },
            ],
        }));
    }
}
exports.PollModel = PollModel;
