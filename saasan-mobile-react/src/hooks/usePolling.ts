import { useState, useCallback } from "react";
import { apiService } from "@/services/api";
import type { Poll, PollFilters } from "@/types";

export function usePolling() {
  const [loading, setLoading] = useState(false);
  const [currentVotingPollId, setCurrentVotingPollId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);

  const loadPolls = useCallback(async (filters?: PollFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllPolls(filters);
      setPolls(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load polls");
    } finally {
      setLoading(false);
    }
  }, []);

  const voteOnPoll = async (pollId: string, optionId: string | string[]) => {
    setError(null);
    setCurrentVotingPollId(pollId);
    try {
      // Make API call first
      await apiService.voteOnPoll(pollId, optionId);

      // Then reload the specific poll to get accurate server data
      const response = await apiService.getPollById(pollId);
      console.log(response.data);
      const updatedPoll = response.data;

      // Update the polls array with the fresh data
      setPolls((prevPolls) =>
        prevPolls.map((poll) => (poll.id === pollId ? updatedPoll : poll))
      );
      return updatedPoll;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to vote on poll");
      throw err;
    } finally {
      setCurrentVotingPollId("");
    }
  };

  return {
    loading,
    currentVotingPollId,
    error,
    polls,
    loadPolls,
    voteOnPoll,
  };
}
