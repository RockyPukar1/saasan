import db from "../config/database";
import { generateUUID } from "../lib/utils";
import { Poll, PollOption } from "../types";

export class PollModel {
  static async create(pollData: Partial<Poll>): Promise<Poll> {
    const id = generateUUID();
    const [poll] = await db("polls")
      .insert({
        ...pollData,
        id,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");
    return poll;
  }

  static async findById(id: string): Promise<Poll | null> {
    const poll = await db("polls").where({ id }).first();
    if (!poll) return null;

    // Get poll options
    const options = await db("poll_options")
      .where({ poll_id: id })
      .orderBy("created_at", "asc");

    return {
      ...poll,
      options,
    };
  }

  static async findAll(
    filters: {
      limit?: number;
      offset?: number;
      search?: string;
    } = {}
  ): Promise<{ polls: Poll[]; total: number }> {
    // Build base query for filtering
    let baseQuery = db("polls");

    if (filters.search) {
      baseQuery = baseQuery.where("title", "ilike", `%${filters.search}%`);
    }

    // Get total count first
    const totalResult = await baseQuery.clone().count("id as count").first();
    const total = parseInt(totalResult?.count as string) || 0;

    // Build main query for data
    let mainQuery = baseQuery.select("*").orderBy("created_at", "desc");

    // Apply pagination
    if (filters.limit) mainQuery = mainQuery.limit(filters.limit);
    if (filters.offset) mainQuery = mainQuery.offset(filters.offset);

    const polls = await mainQuery;

    // Get options for each poll
    const pollsWithOptions = await Promise.all(
      polls.map(async (poll) => {
        const options = await db("poll_options")
          .where({ poll_id: poll.id })
          .orderBy("created_at", "asc");
        return { ...poll, options };
      })
    );

    return {
      polls: pollsWithOptions,
      total,
    };
  }

  static async update(id: string, updates: Partial<Poll>): Promise<Poll> {
    const [poll] = await db("polls")
      .where({ id })
      .update({ ...updates, updated_at: new Date() })
      .returning("*");

    return poll;
  }

  static async delete(id: string): Promise<boolean> {
    // Delete poll options first
    await db("poll_options").where({ poll_id: id }).del();

    // Delete the poll
    const deletedCount = await db("polls").where({ id }).del();
    return deletedCount > 0;
  }

  static async addOption(
    pollId: string,
    optionText: string
  ): Promise<PollOption> {
    const id = generateUUID();
    const [option] = await db("poll_options")
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

  static async vote(
    pollId: string,
    optionId: string,
    userId: string
  ): Promise<boolean> {
    // Check if user already voted on this poll
    const existingVote = await db("poll_votes")
      .where({ poll_id: pollId, user_id: userId })
      .first();

    if (existingVote) {
      // Update existing vote
      await db("poll_votes")
        .where({ id: existingVote.id })
        .update({ option_id: optionId, updated_at: new Date() });
    } else {
      // Create new vote
      await db("poll_votes").insert({
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

  static async updateVoteCounts(pollId: string): Promise<void> {
    const voteCounts = await db("poll_votes")
      .where({ poll_id: pollId })
      .select("option_id")
      .count("* as count")
      .groupBy("option_id");

    // Reset all options to 0 votes
    await db("poll_options").where({ poll_id: pollId }).update({ votes: 0 });

    // Update vote counts
    for (const voteCount of voteCounts) {
      await db("poll_options")
        .where({ id: voteCount.option_id })
        .update({ votes: parseInt(voteCount.count as string) });
    }
  }

  static async getPollStats(pollId: string): Promise<any> {
    const totalVotes = await db("poll_votes")
      .where({ poll_id: pollId })
      .count("* as count")
      .first();

    const optionStats = await db("poll_options")
      .where({ poll_id: pollId })
      .select("id", "option", "votes")
      .orderBy("votes", "desc");

    return {
      totalVotes: parseInt(totalVotes?.count as string) || 0,
      options: optionStats,
    };
  }

  static async searchByTitle(searchTerm: string, limit = 10): Promise<Poll[]> {
    const polls = await db("polls")
      .where("title", "ilike", `%${searchTerm}%`)
      .limit(limit)
      .orderBy("created_at", "desc");

    // Get options for each poll
    const pollsWithOptions = await Promise.all(
      polls.map(async (poll) => {
        const options = await db("poll_options")
          .where({ poll_id: poll.id })
          .orderBy("created_at", "asc");
        return { ...poll, options };
      })
    );

    return pollsWithOptions;
  }

  static async getAnalytics(): Promise<any> {
    // Get total polls count
    const totalPollsResult = await db("polls").count("id as count").first();
    const totalPolls = parseInt(totalPollsResult?.count as string) || 0;

    // Get active polls count
    const activePollsResult = await db("polls")
      .where("status", "active")
      .count("id as count")
      .first();
    const activePolls = parseInt(activePollsResult?.count as string) || 0;

    // Get total votes count
    const totalVotesResult = await db("poll_votes")
      .count("id as count")
      .first();
    const totalVotes = parseInt(totalVotesResult?.count as string) || 0;

    // Calculate participation rate (simplified)
    const participationRate =
      totalPolls > 0 ? Math.round((totalVotes / (totalPolls * 10)) * 100) : 0;

    // Get category breakdown
    const categoryBreakdown = await db("polls")
      .select("category")
      .count("id as count")
      .groupBy("category")
      .orderBy("count", "desc");

    const categoryData = categoryBreakdown.map((item) => ({
      category: item.category,
      count: parseInt(item.count as string),
      percentage:
        totalPolls > 0
          ? Math.round((parseInt(item.count as string) / totalPolls) * 100)
          : 0,
    }));

    // Get district breakdown
    const districtBreakdown = await db("polls")
      .select("district")
      .count("id as count")
      .whereNotNull("district")
      .groupBy("district")
      .orderBy("count", "desc");

    const districtData = districtBreakdown.map((item) => ({
      district: item.district,
      count: parseInt(item.count as string),
      percentage:
        totalPolls > 0
          ? Math.round((parseInt(item.count as string) / totalPolls) * 100)
          : 0,
    }));

    // Get politician performance (mock data for now)
    const politicianPerformance = await db("polls")
      .leftJoin("politicians", "polls.politician_id", "politicians.id")
      .select(
        "politicians.id as politician_id",
        "politicians.full_name as politician_name"
      )
      .count("polls.id as polls_created")
      .whereNotNull("polls.politician_id")
      .groupBy("politicians.id", "politicians.full_name")
      .orderBy("polls_created", "desc")
      .limit(10);

    const politicianData = politicianPerformance.map((item) => ({
      politician_id: item.politician_id,
      politician_name: item.politician_name,
      polls_created: parseInt(item.polls_created as string),
      total_votes_received: Math.floor(Math.random() * 1000), // Mock data
      average_rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // Mock data: 3-5 rating
    }));

    // Get party performance (mock data for now)
    const partyPerformance = await db("polls")
      .leftJoin("political_parties", "polls.party_id", "political_parties.id")
      .select(
        "political_parties.id as party_id",
        "political_parties.name as party_name"
      )
      .count("polls.id as polls_created")
      .whereNotNull("polls.party_id")
      .groupBy("political_parties.id", "political_parties.name")
      .orderBy("polls_created", "desc")
      .limit(10);

    const partyData = partyPerformance.map((item) => ({
      party_id: item.party_id,
      party_name: item.party_name,
      polls_created: parseInt(item.polls_created as string),
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

  static async getCategories(): Promise<string[]> {
    const categories = await db("polls")
      .select("category")
      .distinct()
      .whereNotNull("category")
      .orderBy("category");

    return categories.map((item) => item.category);
  }

  static async getPoliticianComparison(politicianId: string): Promise<any[]> {
    // Get polls related to this politician
    const polls = await db("polls")
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

  static async getPartyComparison(partyId: string): Promise<any[]> {
    // Get polls related to this party
    const polls = await db("polls").where("party_id", partyId).select("*");

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
