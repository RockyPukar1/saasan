"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollController = void 0;
const ResponseHelper_1 = require("../lib/helpers/ResponseHelper");
const PollModel_1 = require("../models/PollModel");
const ValidationHelper_1 = require("../lib/helpers/ValidationHelper");
class PollController {
    static async getAll(req, res) {
        try {
            const { page = 1, limit = 20, search } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            let result;
            if (search) {
                const polls = await PollModel_1.PollModel.searchByTitle(search, Number(limit));
                result = { polls, total: polls.length };
            }
            else {
                result = await PollModel_1.PollModel.findAll({
                    limit: Number(limit),
                    offset,
                    search: search,
                });
            }
            res.json(ResponseHelper_1.ResponseHelper.paginated(result.polls, result.total, Number(page), Number(limit)));
        }
        catch (error) {
            console.error("Get all polls error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch polls"));
        }
    }
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const poll = await PollModel_1.PollModel.findById(id);
            if (!poll) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Poll not found"));
                return;
            }
            // Get poll statistics
            const stats = await PollModel_1.PollModel.getPollStats(id);
            res.json(ResponseHelper_1.ResponseHelper.success({
                ...poll,
                statistics: stats,
            }));
        }
        catch (error) {
            console.error("Get poll by ID error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to fetch poll"));
        }
    }
    static async create(req, res) {
        try {
            const { error, value } = ValidationHelper_1.ValidationHelper.pollCreation.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            const poll = await PollModel_1.PollModel.create({
                title: value.title,
                description: value.description,
            });
            // Add poll options
            if (value.options && Array.isArray(value.options)) {
                for (const optionText of value.options) {
                    await PollModel_1.PollModel.addOption(poll.id, optionText);
                }
            }
            // Get the complete poll with options
            const completePoll = await PollModel_1.PollModel.findById(poll.id);
            res
                .status(201)
                .json(ResponseHelper_1.ResponseHelper.success(completePoll, "Poll created successfully"));
        }
        catch (error) {
            console.error("Create poll error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to create poll"));
        }
    }
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = ValidationHelper_1.ValidationHelper.pollUpdate.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            const existingPoll = await PollModel_1.PollModel.findById(id);
            if (!existingPoll) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Poll not found"));
                return;
            }
            const updatedPoll = await PollModel_1.PollModel.update(id, {
                title: value.title,
                description: value.description,
            });
            res.json(ResponseHelper_1.ResponseHelper.success(updatedPoll, "Poll updated successfully"));
        }
        catch (error) {
            console.error("Update poll error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to update poll"));
        }
    }
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const existingPoll = await PollModel_1.PollModel.findById(id);
            if (!existingPoll) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Poll not found"));
                return;
            }
            const deleted = await PollModel_1.PollModel.delete(id);
            if (deleted) {
                res.json(ResponseHelper_1.ResponseHelper.success(null, "Poll deleted successfully"));
            }
            else {
                res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to delete poll"));
            }
        }
        catch (error) {
            console.error("Delete poll error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to delete poll"));
        }
    }
    static async addOption(req, res) {
        try {
            const { id } = req.params;
            const { error, value } = ValidationHelper_1.ValidationHelper.pollOption.validate(req.body);
            if (error) {
                res
                    .status(400)
                    .json(ResponseHelper_1.ResponseHelper.error("Validation failed", 400, error.details));
                return;
            }
            const existingPoll = await PollModel_1.PollModel.findById(id);
            if (!existingPoll) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Poll not found"));
                return;
            }
            const option = await PollModel_1.PollModel.addOption(id, value.option);
            res
                .status(201)
                .json(ResponseHelper_1.ResponseHelper.success(option, "Option added successfully"));
        }
        catch (error) {
            console.error("Add option error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to add option"));
        }
    }
    static async vote(req, res) {
        try {
            const { id, optionId } = req.params;
            const userId = req.user?.userId;
            if (!userId) {
                res.status(401).json(ResponseHelper_1.ResponseHelper.error("Authentication required"));
                return;
            }
            const existingPoll = await PollModel_1.PollModel.findById(id);
            if (!existingPoll) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Poll not found"));
                return;
            }
            // Check if option exists
            const optionExists = existingPoll.options.find((opt) => opt.id === optionId);
            if (!optionExists) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Poll option not found"));
                return;
            }
            const success = await PollModel_1.PollModel.vote(id, optionId, userId);
            if (success) {
                // Get updated poll with new vote counts
                const updatedPoll = await PollModel_1.PollModel.findById(id);
                const stats = await PollModel_1.PollModel.getPollStats(id);
                res.json(ResponseHelper_1.ResponseHelper.success({
                    poll: updatedPoll,
                    statistics: stats,
                }, "Vote recorded successfully"));
            }
            else {
                res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to record vote"));
            }
        }
        catch (error) {
            console.error("Vote error:", error);
            res.status(500).json(ResponseHelper_1.ResponseHelper.error("Failed to record vote"));
        }
    }
    static async getStats(req, res) {
        try {
            const { id } = req.params;
            const existingPoll = await PollModel_1.PollModel.findById(id);
            if (!existingPoll) {
                res.status(404).json(ResponseHelper_1.ResponseHelper.error("Poll not found"));
                return;
            }
            const stats = await PollModel_1.PollModel.getPollStats(id);
            res.json(ResponseHelper_1.ResponseHelper.success(stats));
        }
        catch (error) {
            console.error("Get poll stats error:", error);
            res
                .status(500)
                .json(ResponseHelper_1.ResponseHelper.error("Failed to fetch poll statistics"));
        }
    }
}
exports.PollController = PollController;
