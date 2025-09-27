import { Request, Response } from "express";
import { ResponseHelper } from "../lib/helpers/ResponseHelper";
import { PollModel } from "../models/PollModel";
import { ValidationHelper } from "../lib/helpers/ValidationHelper";
import { PollOption } from "../../../shared/types";

export class PollController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const userId = req.user?.userId;

      const offset = (Number(page) - 1) * Number(limit);

      let result;

      if (search) {
        const polls = await PollModel.searchByTitle(
          search as string,
          Number(limit),
          userId
        );
        result = { polls, total: polls.length };
      } else {
        result = await PollModel.findAll({
          limit: Number(limit),
          offset,
          search: search as string,
          userId: userId,
        });
      }

      res.json(
        ResponseHelper.paginated(
          result.polls,
          result.total,
          Number(page),
          Number(limit)
        )
      );
    } catch (error) {
      console.error("Get all polls error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch polls"));
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const poll = await PollModel.findById(id, userId);

      if (!poll) {
        res.status(404).json(ResponseHelper.error("Poll not found"));
        return;
      }

      // Get poll statistics
      const stats = await PollModel.getPollStats(id);

      res.json(
        ResponseHelper.success({
          ...poll,
          statistics: stats,
        })
      );
    } catch (error) {
      console.error("Get poll by ID error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch poll"));
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = ValidationHelper.pollCreation.validate(req.body);

      if (error) {
        res
          .status(400)
          .json(ResponseHelper.error("Validation failed", 400, error.details));
        return;
      }

      const poll = await PollModel.create({
        title: value.title,
        description: value.description,
        type: value.type,
        status: value.status,
        category: value.category,
        start_date: new Date().toISOString(),
        end_date: value.end_date,
        is_anonymous: value.is_anonymous,
        requires_verification: value.requires_verification,
        created_by: req.user?.userId || "1",
        total_votes: 0,
      });

      // Add poll options
      if (value.options && Array.isArray(value.options)) {
        for (const optionText of value.options) {
          await PollModel.addOption(poll.id, optionText);
        }
      }

      // Get the complete poll with options
      const completePoll = await PollModel.findById(poll.id);

      res
        .status(201)
        .json(
          ResponseHelper.success(completePoll, "Poll created successfully")
        );
    } catch (error) {
      console.error("Create poll error:", error);
      res.status(500).json(ResponseHelper.error("Failed to create poll"));
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error, value } = ValidationHelper.pollUpdate.validate(req.body);

      if (error) {
        res
          .status(400)
          .json(ResponseHelper.error("Validation failed", 400, error.details));
        return;
      }

      const existingPoll = await PollModel.findById(id);
      if (!existingPoll) {
        res.status(404).json(ResponseHelper.error("Poll not found"));
        return;
      }

      const updatedPoll = await PollModel.update(id, {
        title: value.title,
        description: value.description,
      });

      res.json(
        ResponseHelper.success(updatedPoll, "Poll updated successfully")
      );
    } catch (error) {
      console.error("Update poll error:", error);
      res.status(500).json(ResponseHelper.error("Failed to update poll"));
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const existingPoll = await PollModel.findById(id);

      if (!existingPoll) {
        res.status(404).json(ResponseHelper.error("Poll not found"));
        return;
      }

      const deleted = await PollModel.delete(id);

      if (deleted) {
        res.json(ResponseHelper.success(null, "Poll deleted successfully"));
      } else {
        res.status(500).json(ResponseHelper.error("Failed to delete poll"));
      }
    } catch (error) {
      console.error("Delete poll error:", error);
      res.status(500).json(ResponseHelper.error("Failed to delete poll"));
    }
  }

  static async addOption(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error, value } = ValidationHelper.pollOption.validate(req.body);

      if (error) {
        res
          .status(400)
          .json(ResponseHelper.error("Validation failed", 400, error.details));
        return;
      }

      const existingPoll = await PollModel.findById(id);
      if (!existingPoll) {
        res.status(404).json(ResponseHelper.error("Poll not found"));
        return;
      }

      const option = await PollModel.addOption(id, value.text);

      res
        .status(201)
        .json(ResponseHelper.success(option, "Option added successfully"));
    } catch (error) {
      console.error("Add option error:", error);
      res.status(500).json(ResponseHelper.error("Failed to add option"));
    }
  }

  static async vote(req: Request, res: Response): Promise<void> {
    try {
      const { id, optionId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json(ResponseHelper.error("Authentication required"));
        return;
      }

      const existingPoll = await PollModel.findById(id);
      if (!existingPoll) {
        res.status(404).json(ResponseHelper.error("Poll not found"));
        return;
      }

      // Check if option exists
      const optionExists = existingPoll.options.find(
        (opt: PollOption) => opt.id === optionId
      );
      if (!optionExists) {
        res.status(404).json(ResponseHelper.error("Poll option not found"));
        return;
      }

      const success = await PollModel.vote(id, optionId, userId);

      if (success) {
        // Get updated poll with new vote counts
        const userId = req.user?.userId;
        const updatedPoll = await PollModel.findById(id, userId);
        const stats = await PollModel.getPollStats(id);

        res.json(
          ResponseHelper.success(
            {
              poll: updatedPoll,
              statistics: stats,
            },
            "Vote recorded successfully"
          )
        );
      } else {
        res.status(500).json(ResponseHelper.error("Failed to record vote"));
      }
    } catch (error) {
      console.error("Vote error:", error);
      res.status(500).json(ResponseHelper.error("Failed to record vote"));
    }
  }

  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const existingPoll = await PollModel.findById(id);

      if (!existingPoll) {
        res.status(404).json(ResponseHelper.error("Poll not found"));
        return;
      }

      const stats = await PollModel.getPollStats(id);

      res.json(ResponseHelper.success(stats));
    } catch (error) {
      console.error("Get poll stats error:", error);
      res
        .status(500)
        .json(ResponseHelper.error("Failed to fetch poll statistics"));
    }
  }
}
