import db from "../config/database";
import { generateUUID } from "../lib/utils";

export enum PromiseStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  BROKEN = "broken",
  MODIFIED = "modified",
}

export interface PoliticalPromise {
  id: string;
  politicianId: string;
  title: string;
  description: string;
  category: string;
  promiseDate: Date;
  targetCompletionDate?: Date;
  actualCompletionDate?: Date;
  status: PromiseStatus;
  progressPercentage: number;
  budgetAllocated: number;
  budgetSpent: number;
  sourceUrl: string;
  verificationStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PoliticalPromiseModel {
  static async create(
    promiseData: Partial<PoliticalPromise>
  ): Promise<PoliticalPromise> {
    const id = generateUUID();

    const [promise] = await db("political_promises")
      .insert({
        ...promiseData,
        id,
        progressPercentage: 0,
        verificationStatus: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning("*");

    return promise;
  }

  static async findByPolitician(
    politicianId: string
  ): Promise<PoliticalPromise[]> {
    return db("political_promises")
      .where({ politicianId })
      .orderBy("promiseDate", "desc");
  }

  static async updateProgress(
    id: string,
    progressPercentage: number,
    status?: PromiseStatus
  ): Promise<PoliticalPromise> {
    const updateData: any = {
      progressPercentage,
      updatedAt: new Date(),
    };

    if (status) updateData.status = status;
    if (status === PromiseStatus.COMPLETED)
      updateData.actualCompletionDate = new Date();

    const [promise] = await db("political_promises")
      .where({ id })
      .update(updateData)
      .returning("*");

    return promise;
  }

  static async getStatsByPolitician(politicalId: string): Promise<any> {
    const stats = await db("political_promises")
      .where({ politicalId })
      .select("status")
      .count("* as count")
      .groupBy("status");

    const summary = await db("political_promises")
      .where({ politicalId })
      .select(
        db.raw("COUNT(*) as total"),
        db.raw("AVG(progress_percentage) as avgProgress"),
        db.raw("SUM(budget_allocated) as totalBudgetAllocated"),
        db.raw("SUM(budget_spent) as totalBudgetSpent")
      )
      .first();

    return { breakdown: stats, summary };
  }
}
