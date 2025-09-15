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
        created_at: new Date(),
        updated_at: new Date(),
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
        "politicians.*",
        "positions.title as positionTitle",
        "political_parties.name as partyName"
      )
      .leftJoin("positions", "politicians.position_id", "positions.id")
      .leftJoin(
        "political_parties",
        "politicians.party_id",
        "political_parties.id"
      );
    if (filters.district)
      query = query.where("politicians.district", filters.district);
    if (filters.municipality)
      query = query.where("politicians.municipality", filters.municipality);
    if (filters.partyId)
      query = query.where("politicians.party_id", filters.partyId);
    if (filters.positionId)
      query = query.where("politicians.position_id", filters.positionId);
    if (filters.status)
      query = query.where(
        "politicians.is_active",
        filters.status === PoliticianStatus.ACTIVE
      );

    const total = await db("politicians")
      .leftJoin("positions", "politicians.position_id", "positions.id")
      .leftJoin(
        "political_parties",
        "politicians.party_id",
        "political_parties.id"
      )
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
          queryBuilder.where(
            "politicians.is_active",
            filters.status === PoliticianStatus.ACTIVE
          );
        }
      })
      .count("* as count")
      .first();

    if (filters.limit) query = query.limit(filters.limit);
    if (filters.offset) query = query.offset(filters.offset);

    const politicians = await query;

    return {
      politicians,
      total: parseInt(total?.count as string) || 0,
    };
  }

  static async findByLevel(
    level: string,
    filters: {
      district?: string;
      municipality?: string;
      partyId?: number;
      positionId?: number;
      status?: PoliticianStatus;
      limit?: number;
      offset?: number;
      search?: string;
    } = {}
  ): Promise<{ politicians: Politician[]; total: number }> {
    // Normalize level name to match database values
    const levelMapping: { [key: string]: string } = {
      federal: "Federal",
      provincial: "Provincial",
      district: "District",
      municipal: "Municipal",
      ward: "Ward",
    };

    const normalizedLevel = levelMapping[level.toLowerCase()] || level;

    // Build base query for filtering
    let baseQuery = db("politicians")
      .leftJoin("positions", "politicians.position_id", "positions.id")
      .leftJoin(
        "political_parties",
        "politicians.party_id",
        "political_parties.id"
      )
      .leftJoin(
        "constituencies",
        "politicians.constituency_id",
        "constituencies.id"
      )
      .leftJoin("levels", "positions.level_id", "levels.id")
      .where("levels.name", "ilike", `%${normalizedLevel}%`);

    // Apply filters to base query
    if (filters.district)
      baseQuery = baseQuery.where("politicians.district", filters.district);
    if (filters.municipality)
      baseQuery = baseQuery.where(
        "politicians.municipality",
        filters.municipality
      );
    if (filters.partyId)
      baseQuery = baseQuery.where("politicians.party_id", filters.partyId);
    if (filters.positionId)
      baseQuery = baseQuery.where(
        "politicians.position_id",
        filters.positionId
      );
    if (filters.status)
      baseQuery = baseQuery.where(
        "politicians.is_active",
        filters.status === PoliticianStatus.ACTIVE
      );
    if (filters.search)
      baseQuery = baseQuery.where(
        "politicians.full_name",
        "ilike",
        `%${filters.search}%`
      );

    // Get total count first
    const totalResult = await baseQuery
      .clone()
      .count("politicians.id as count")
      .first();
    const total = parseInt(totalResult?.count as string) || 0;

    // Build main query for data
    let mainQuery = baseQuery.select(
      "politicians.*",
      "positions.title as positionTitle",
      "political_parties.name as partyName",
      "constituencies.name as constituencyName",
      "levels.name as levelName"
    );

    // Apply pagination
    if (filters.limit) mainQuery = mainQuery.limit(filters.limit);
    if (filters.offset) mainQuery = mainQuery.offset(filters.offset);

    const politicians = await mainQuery;

    return {
      politicians,
      total,
    };
  }

  static async getGovernmentLevels(): Promise<any[]> {
    const levels = await db("levels")
      .select("levels.id", "levels.name", "levels.description")
      .orderBy("levels.id");

    // Get counts for each level separately to avoid GROUP BY issues
    const levelCounts = await db("levels")
      .select("levels.id", db.raw("COUNT(DISTINCT politicians.id) as count"))
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
        count: parseInt(countData?.count as string) || 0,
      };
    });
  }

  static async searchByName(
    searchTerm: string,
    limit = 10
  ): Promise<Politician[]> {
    return db("politicians")
      .select(
        "politicians.*",
        "positions.title as positionTitle",
        "political_parties.name as partyName",
        "constituencies.name as constituencyName"
      )
      .leftJoin("positions", "politicians.position_id", "positions.id")
      .leftJoin(
        "political_parties",
        "politicians.party_id",
        "political_parties.id"
      )
      .leftJoin(
        "constituencies",
        "politicians.constituency_id",
        "constituencies.id"
      )
      .where("full_name", "ilike", `%${searchTerm}%`)
      .limit(limit);
  }

  static async update(
    id: string,
    updates: Partial<Politician>
  ): Promise<Politician> {
    const [politician] = await db("politicians")
      .where({ id })
      .update({ ...updates, updated_at: new Date() })
      .returning("*");

    return politician;
  }

  static async getPerformanceMetrics(id: string): Promise<any> {
    const promises = await db("political_promises")
      .where({ politician_id: id })
      .select("status")
      .count("* as count")
      .groupBy("status");

    const ratings = await db("politician_ratings")
      .where({ politician_id: id })
      .avg("rating as averageRating")
      .count("* as totalRatings")
      .first();

    return { promises, ratings };
  }
}
