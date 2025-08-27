import { Request, Response } from "express";
import { ResponseHelper } from "../lib/helpers/ResponseHelper";
import { PoliticianModel } from "../models/PoliticianModel";
import { PoliticalPromiseModel } from "../models/PoliticalPromiseModel";
import { ValidationHelper } from "../lib/helpers/ValidationHelper";
import db from "../config/database";

export class PoliticianController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {
        district,
        municipality,
        partyId,
        positionId,
        status,
        page = 1,
        limit = 20,
        search,
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      let result;

      if (search) {
        const politicians = await PoliticianModel.searchByName(
          search as string,
          Number(limit)
        );

        result = { politicians, total: politicians.length };
      } else {
        result = await PoliticianModel.findAll({
          district: district as string,
          municipality: municipality as string,
          partyId: partyId ? Number(partyId) : undefined,
          positionId: positionId ? Number(positionId) : undefined,
          status: status as any,
          limit: Number(limit),
          offset,
        });
      }

      res.json(
        ResponseHelper.paginated(
          result.politicians,
          result.total,
          Number(page),
          Number(limit)
        )
      );
    } catch (error) {
      console.error("Get all politicians error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch politicians"));
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const politician = await PoliticianModel.findById(id);

      if (!politician) {
        res.status(404).json(ResponseHelper.error("Politician not found"));
      }

      // Get performance metrics
      const metrics = await PoliticianModel.getPerformanceMetrics(id);

      res.json(
        ResponseHelper.success({
          ...politician,
          performanceMetrics: metrics,
        })
      );
    } catch (error) {
      console.error("Get politician by ID error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch politician"));
    }
  }

  static async getPromises(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const promises = await PoliticalPromiseModel.findByPolitician(id);
      const stats = await PoliticalPromiseModel.getStatsByPolitician(id);

      res.json(
        ResponseHelper.success({
          promises,
          statistics: stats,
        })
      );
    } catch (error) {
      console.error("Get politician promises error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch promises"));
    }
  }

  static async getGovernmentLevels(req: Request, res: Response): Promise<void> {
    try {
      const levels = await PoliticianModel.getGovernmentLevels();
      res.json(ResponseHelper.success(levels));
    } catch (error) {
      console.error("Get government levels error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch government levels"));
    }
  }

  static async getByLevel(req: Request, res: Response): Promise<void> {
    try {
      const { level } = req.params;
      const {
        district,
        municipality,
        partyId,
        positionId,
        status,
        page = 1,
        limit = 20,
        search,
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      const result = await PoliticianModel.findByLevel(level, {
        district: district as string,
        municipality: municipality as string,
        partyId: partyId ? Number(partyId) : undefined,
        positionId: positionId ? Number(positionId) : undefined,
        status: status as any,
        limit: Number(limit),
        offset,
        search: search as string,
      });

      res.json(
        ResponseHelper.paginated(
          result.politicians,
          result.total,
          Number(page),
          Number(limit)
        )
      );
    } catch (error) {
      console.error("Get politicians by level error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch politicians by level"));
    }
  }

  static async ratePolitician(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error, value } = ValidationHelper.politicianRating.validate(
        req.body
      );

      if (error) {
        res
          .status(400)
          .json(ResponseHelper.error("Validation failed", 400, error.details));
        return;
      }

      // Check if the user already rated this politician in this category
      const existingRating = await db("politician_ratings")
        .where({
          politicianId: id,
          userId: req.user.userId,
          category: value.category,
        })
        .first();

      if (existingRating) {
        // Update existing rating
        await db("politician_ratings").where({ id: existingRating.id }).update({
          rating: value.rating,
          comment: value.comment,
          updatedAt: new Date(),
        });
      } else {
        // Create new rating
        await db("politician_ratings").insert({
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

      res.json(ResponseHelper.success(null, "Rating submitted successfully"));
    } catch (error) {
      console.error("Rate politician error:", error);
      res.status(500).json(ResponseHelper.error("Failed to submit rating"));
    }
  }
}
