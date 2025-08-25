import db from "../config/database";
import { generateUUID } from "../lib/utils";
import { Politician, PoliticianStatus } from "../types";

export class PoliticianModel {
  static async create(
    politicianData: Partial<Politician>
  ): Promise<Politician> {
    const id = generateUUID();
    const [politician] = await db("politicians")
      .insert({
        ...politicianData,
        id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning("*");
    return politician;
  }

  static async findById(id: string): Promise<Politician | null> {
    const politician = await db("politicians").where({ id }).first();
    return politician || null;
  }

  static async findAll(
    filters: {
      district?: string;
      municipality?: string;
      partyId?: number;
      positionId?: number;
      status?: PoliticianStatus;
      limit?: number;
      offset?: number;
    } = {}
  ): Promise<{ politicians: Politician[]; total: number }> {
    let query = db("politicians")
      .select(
        "politician.*",
        "positions.title as positionTitle",
        "political_parties.name as partyName"
      )
      .leftJoin("positions", "politicians.positionId", "positions.id")
      .leftJoin(
        "political_parties",
        "politicians.partyId",
        "political_parties.id"
      );
    if (filters.district)
      query = query.where("politicians.district", filters.district);
    if (filters.municipality)
      query = query.where("politicians.municipality", filters.municipality);
    if (filters.partyId)
      query = query.where("politicians.partyId", filters.partyId);
    if (filters.positionId)
      query = query.where("politicians.positionId", filters.positionId);
    if (filters.status)
      query = query.where("politicians.status", filters.status);

    const total = await query.clone().count("* as count").first();

    if (filters.limit) query = query.limit(filters.limit);
    if (filters.offset) query = query.offset(filters.offset);

    const politicians = await query;

    return {
      politicians,
      total: parseInt(total?.count as string) || 0,
    };
  }

  static async searchByName(
    searchTerm: string,
    limit = 10
  ): Promise<Politician[]> {
    return db("politicians")
      .where("fullName", "ilike", `%${searchTerm}%`)
      .limit(limit);
  }

  static async update(
    id: string,
    updates: Partial<Politician>
  ): Promise<Politician> {
    const [politician] = await db("politicians")
      .where({ id })
      .update({ ...updates, updatedAt: new Date() })
      .returning("*");

    return politician;
  }

  static async getPerformanceMetrics(id: string): Promise<any> {
    const promises = await db("political_promises")
      .where({ politicianId: id })
      .select("status")
      .count("* as count")
      .groupBy("status");

    const ratings = await db("politician_ratings")
      .where({ politicianId: id })
      .avg("rating as averageRating")
      .count("* as totalRatings")
      .first();

    return { promises, ratings };
  }
}
