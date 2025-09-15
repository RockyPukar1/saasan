import { Request, Response } from "express";
import { ResponseHelper } from "../lib/helpers/ResponseHelper";
import { ValidationHelper } from "../lib/helpers/ValidationHelper";
import db from "../config/database";
import { generateUUID } from "../lib/utils";

export class MajorCaseController {
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { status, priority, page = 1, limit = 20, search } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      let query = db("major_cases").select("*");

      // Apply filters
      if (status) query = query.where("status", status);
      if (priority) query = query.where("priority", priority);
      if (search) {
        query = query.where(function () {
          this.where("title", "ilike", `%${search}%`)
            .orWhere("description", "ilike", `%${search}%`)
            .orWhere("reference_number", "ilike", `%${search}%`);
        });
      }

      const total = await db("major_cases")
        .modify((queryBuilder) => {
          if (status) queryBuilder.where("status", status);
          if (priority) queryBuilder.where("priority", priority);
          if (search) {
            queryBuilder.where(function () {
              this.where("title", "ilike", `%${search}%`).orWhere(
                "description",
                "ilike",
                `%${search}%`
              );
            });
          }
        })
        .count("* as count")
        .first();

      // Sorting and pagination
      query = query.orderBy("created_at", "desc");
      if (limit) query = query.limit(Number(limit));
      if (offset) query = query.offset(offset);

      const cases = await query;

      res.json(
        ResponseHelper.paginated(
          cases,
          Number(total?.count) || 0,
          Number(page),
          Number(limit)
        )
      );
    } catch (error) {
      console.error("Get major cases error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch major cases"));
    }
  }

  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const case_ = await db("major_cases").where({ id }).first();

      if (!case_) {
        res.status(404).json(ResponseHelper.error("Major case not found"));
        return;
      }

      res.json(ResponseHelper.success(case_));
    } catch (error) {
      console.error("Get major case by ID error:", error);
      res.status(500).json(ResponseHelper.error("Failed to fetch major case"));
    }
  }

  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value } = ValidationHelper.majorCase.validate(req.body);

      if (error) {
        res
          .status(400)
          .json(ResponseHelper.error("Validation failed", 400, error.details));
        return;
      }

      const id = generateUUID();
      const case_ = await db("major_cases")
        .insert({
          id,
          ...value,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning("*");

      res
        .status(201)
        .json(
          ResponseHelper.success(case_[0], "Major case created successfully")
        );
    } catch (error) {
      console.error("Create major case error:", error);
      res.status(500).json(ResponseHelper.error("Failed to create major case"));
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { error, value } = ValidationHelper.majorCaseUpdate.validate(
        req.body
      );

      if (error) {
        res
          .status(400)
          .json(ResponseHelper.error("Validation failed", 400, error.details));
        return;
      }

      const case_ = await db("major_cases")
        .where({ id })
        .update({
          ...value,
          updated_at: new Date(),
        })
        .returning("*");

      if (!case_.length) {
        res.status(404).json(ResponseHelper.error("Major case not found"));
        return;
      }

      res.json(
        ResponseHelper.success(case_[0], "Major case updated successfully")
      );
    } catch (error) {
      console.error("Update major case error:", error);
      res.status(500).json(ResponseHelper.error("Failed to update major case"));
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await db("major_cases").where({ id }).del();

      if (!deleted) {
        res.status(404).json(ResponseHelper.error("Major case not found"));
        return;
      }

      res.json(ResponseHelper.success(null, "Major case deleted successfully"));
    } catch (error) {
      console.error("Delete major case error:", error);
      res.status(500).json(ResponseHelper.error("Failed to delete major case"));
    }
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !["unsolved", "ongoing", "solved"].includes(status)) {
        res.status(400).json(ResponseHelper.error("Invalid status"));
        return;
      }

      const case_ = await db("major_cases")
        .where({ id })
        .update({
          status,
          updated_at: new Date(),
        })
        .returning("*");

      if (!case_.length) {
        res.status(404).json(ResponseHelper.error("Major case not found"));
        return;
      }

      res.json(
        ResponseHelper.success(case_[0], "Case status updated successfully")
      );
    } catch (error) {
      console.error("Update major case status error:", error);
      res
        .status(500)
        .json(ResponseHelper.error("Failed to update case status"));
    }
  }
}
