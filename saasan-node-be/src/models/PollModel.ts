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
    let mainQuery = baseQuery
      .select("*")
      .orderBy("created_at", "desc");

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
}
