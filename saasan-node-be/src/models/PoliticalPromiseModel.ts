import db from "../config/database";
import { generateUUID } from "../lib/utils";

export interface PoliticalPromise {
  id: string;
  politician_id: string;
  title: string;
  description: string;
  category: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  target_date: Date;
  progress_percentage: number;
  created_at: Date;
  updated_at: Date;
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
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");
    return promise;
  }

  static async findByPolitician(politicianId: string): Promise<PoliticalPromise[]> {
    return db("political_promises")
      .where({ politician_id: politicianId })
      .orderBy("created_at", "desc");
  }

  static async getStatsByPolitician(politicianId: string): Promise<any> {
    const stats = await db("political_promises")
      .where({ politician_id: politicianId })
      .select("status")
      .count("* as count")
      .groupBy("status");

    const total = await db("political_promises")
      .where({ politician_id: politicianId })
      .count("* as total")
      .first();

    const completed = stats.find(s => s.status === 'completed')?.count || 0;
    const inProgress = stats.find(s => s.status === 'in_progress')?.count || 0;
    const notStarted = stats.find(s => s.status === 'not_started')?.count || 0;
    const failed = stats.find(s => s.status === 'failed')?.count || 0;

    return {
      total: parseInt(total?.total as string) || 0,
      completed: parseInt(completed as string) || 0,
      inProgress: parseInt(inProgress as string) || 0,
      notStarted: parseInt(notStarted as string) || 0,
      failed: parseInt(failed as string) || 0,
      completionRate: total?.total ? Math.round((parseInt(completed as string) / parseInt(total.total as string)) * 100) : 0
    };
  }

  static async update(
    id: string,
    updates: Partial<PoliticalPromise>
  ): Promise<PoliticalPromise> {
    const [promise] = await db("political_promises")
      .where({ id })
      .update({ ...updates, updated_at: new Date() })
      .returning("*");

    return promise;
  }

  static async delete(id: string): Promise<boolean> {
    const deletedCount = await db("political_promises").where({ id }).del();
    return deletedCount > 0;
  }
}
