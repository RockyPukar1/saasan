import db from "../config/database";
import { generateUUID } from "../lib/utils";
import { Politician, PoliticianStatus } from "../../../shared/types";

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
        "politicians.position as positionTitle",
        "political_parties.name as partyName"
      )
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
      query = query.where("politicians.position", filters.positionId);
    if (filters.status)
      query = query.where(
        "politicians.is_active",
        filters.status === PoliticianStatus.ACTIVE
      );

    const total = await db("politicians")
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
          queryBuilder.where("politicians.position", filters.positionId);
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
      .leftJoin("positions", "politicians.position", "positions.title")
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
      baseQuery = baseQuery.where("politicians.position", filters.positionId);
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
      .leftJoin("politicians", "positions.title", "politicians.position")
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
        "politicians.position as positionTitle",
        "political_parties.name as partyName",
        "constituencies.name as constituencyName"
      )
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

  static async getDetailedProfile(id: string): Promise<any> {
    // Get basic politician info with joins
    const politician = await db("politicians")
      .select(
        "politicians.*",
        "political_parties.name as partyName",
        "political_parties.name_nepali as partyNameNepali",
        "constituencies.name as constituencyName",
        "constituencies.name_nepali as constituencyNameNepali",
        "positions.title as positionTitle",
        "positions.title_nepali as positionTitleNepali",
        "levels.name as levelName",
        "levels.name_nepali as levelNameNepali"
      )
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
      .leftJoin("positions", "politicians.position", "positions.title")
      .leftJoin("levels", "positions.level_id", "levels.id")
      .where("politicians.id", id)
      .first();

    if (!politician) return null;

    // Get promises
    const promises = await db("political_promises")
      .where({ politician_id: id })
      .orderBy("created_at", "desc");

    // Get achievements
    const achievements = await db("politician_achievements")
      .where({ politician_id: id })
      .orderBy("achievement_date", "desc");

    // Get contacts
    const contacts = await db("politician_contacts")
      .where({ politician_id: id })
      .orderBy("is_primary", "desc");

    // Get social media
    const socialMedia = await db("politician_social_media").where({
      politician_id: id,
    });

    // Get budget tracking
    const budgetTracking = await db("politician_budget_tracking")
      .where({ politician_id: id })
      .orderBy("fiscal_year", "desc");

    // Get attendance records
    const attendance = await db("politician_attendance")
      .where({ politician_id: id })
      .orderBy("session_date", "desc")
      .limit(30);

    // Get ratings by category
    const ratings = await db("politician_ratings")
      .select("category")
      .avg("rating as averageRating")
      .count("* as totalRatings")
      .where({ politician_id: id })
      .groupBy("category");

    // Calculate overall performance metrics
    const performanceMetrics = await this.getPerformanceMetrics(id);

    return {
      ...politician,
      promises,
      achievements,
      contacts,
      socialMedia,
      budgetTracking,
      attendance,
      ratings,
      performanceMetrics,
    };
  }

  static async getPoliticianPromises(id: string): Promise<any[]> {
    return db("political_promises")
      .where({ politician_id: id })
      .orderBy("created_at", "desc");
  }

  static async getPoliticianAchievements(id: string): Promise<any[]> {
    return db("politician_achievements")
      .where({ politician_id: id })
      .orderBy("achievement_date", "desc");
  }

  static async getPoliticianContacts(id: string): Promise<any[]> {
    return db("politician_contacts")
      .where({ politician_id: id })
      .orderBy("is_primary", "desc");
  }

  static async getPoliticianSocialMedia(id: string): Promise<any[]> {
    return db("politician_social_media").where({ politician_id: id });
  }

  static async getPoliticianBudgetTracking(id: string): Promise<any[]> {
    return db("politician_budget_tracking")
      .where({ politician_id: id })
      .orderBy("fiscal_year", "desc");
  }

  static async getPoliticianAttendance(id: string, limit = 30): Promise<any[]> {
    return db("politician_attendance")
      .where({ politician_id: id })
      .orderBy("session_date", "desc")
      .limit(limit);
  }

  static async getPoliticianRatings(id: string): Promise<any[]> {
    return db("politician_ratings")
      .select("category")
      .avg("rating as averageRating")
      .count("* as totalRatings")
      .where({ politician_id: id })
      .groupBy("category");
  }
}
