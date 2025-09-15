import { useState, useCallback } from "react";
import { apiService } from "~/services/api";
import {
  Poll,
  PollFilters,
  CreatePollData,
  UpdatePollData,
  PollStatus,
} from "~/types/polling";

export function usePolling() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  const loadPolls = useCallback(async (filters?: PollFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllPolls(filters);
      setPolls(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load polls");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPollById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getPollById(id);
      setCurrentPoll(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load poll");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadUserPolls = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getUserPolls();
      setPolls(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load user polls"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const createPoll = useCallback(async (data: CreatePollData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.createPoll(data);
      setCurrentPoll(response.data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create poll");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePoll = useCallback(async (id: string, data: UpdatePollData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.updatePoll(id, data);
      setCurrentPoll(response.data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update poll");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePoll = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await apiService.deletePoll(id);
        setPolls((prev) => prev.filter((poll) => poll.id !== id));
        if (currentPoll?.id === id) {
          setCurrentPoll(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete poll");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentPoll?.id]
  );

  const voteOnPoll = useCallback(
    async (pollId: string, optionId: string | string[]) => {
      setError(null);

      // Find the poll to update
      const pollIndex = polls.findIndex((p) => p.id === pollId);
      if (pollIndex === -1) {
        setError("Poll not found");
        return;
      }

      const poll = polls[pollIndex];
      const isMultipleChoice = poll.type === "multiple_choice";

      // Determine new vote state
      let newUserVote: string | string[] | undefined;
      let voteDelta = 0; // +1 for vote, -1 for unvote

      if (isMultipleChoice) {
        const currentVotes = Array.isArray(poll.user_vote)
          ? poll.user_vote
          : [];
        const optionIds = Array.isArray(optionId) ? optionId : [optionId];

        // Toggle each option
        const newVotes = [...currentVotes];
        optionIds.forEach((id) => {
          const index = newVotes.indexOf(id);
          if (index > -1) {
            newVotes.splice(index, 1);
            voteDelta -= 1; // Unvote
          } else {
            newVotes.push(id);
            voteDelta += 1; // Vote
          }
        });

        newUserVote = newVotes.length > 0 ? newVotes : undefined;
      } else {
        // Single choice - toggle
        const currentVote = poll.user_vote;
        if (currentVote === optionId) {
          newUserVote = undefined; // Unvote
          voteDelta = -1;
        } else {
          newUserVote = optionId; // Vote
          voteDelta = currentVote ? 0 : 1; // If switching votes, no net change
        }
      }

      // Optimistic update
      const updatedPolls = [...polls];
      const updatedPoll = { ...poll };

      // Update user vote
      updatedPoll.user_vote = newUserVote;

      // Update vote counts optimistically
      if (isMultipleChoice) {
        const optionIds = Array.isArray(optionId) ? optionId : [optionId];
        optionIds.forEach((id) => {
          const option = updatedPoll.options.find((opt) => opt.id === id);
          if (option) {
            const wasSelected =
              Array.isArray(poll.user_vote) && poll.user_vote.includes(id);
            if (wasSelected) {
              option.votes_count = Math.max(0, option.votes_count - 1);
            } else {
              option.votes_count += 1;
            }
          }
        });
      } else {
        // Single choice
        const option = updatedPoll.options.find((opt) => opt.id === optionId);
        if (option) {
          const wasSelected = poll.user_vote === optionId;
          if (wasSelected) {
            option.votes_count = Math.max(0, option.votes_count - 1);
          } else {
            // If switching votes, decrease previous vote count
            if (poll.user_vote) {
              const prevOption = updatedPoll.options.find(
                (opt) => opt.id === poll.user_vote
              );
              if (prevOption) {
                prevOption.votes_count = Math.max(
                  0,
                  prevOption.votes_count - 1
                );
              }
            }
            option.votes_count += 1;
          }
        }
      }

      // Update total votes
      updatedPoll.total_votes = Math.max(0, poll.total_votes + voteDelta);

      // Recalculate percentages
      updatedPoll.options.forEach((option) => {
        option.percentage =
          updatedPoll.total_votes > 0
            ? Math.round((option.votes_count / updatedPoll.total_votes) * 100)
            : 0;
      });

      updatedPolls[pollIndex] = updatedPoll;
      setPolls(updatedPolls);

      // Update current poll if it's the same
      if (currentPoll?.id === pollId) {
        setCurrentPoll(updatedPoll);
      }

      try {
        // Make API call
        await apiService.voteOnPoll(pollId, optionId);

        // Reload poll to get accurate server data
        const response = await apiService.getPollResults(pollId);
        const serverPoll = response.data;

        // Update with server data
        const serverUpdatedPolls = [...polls];
        const serverPollIndex = serverUpdatedPolls.findIndex(
          (p) => p.id === pollId
        );
        if (serverPollIndex !== -1) {
          serverUpdatedPolls[serverPollIndex] = serverPoll;
          setPolls(serverUpdatedPolls);
        }

        if (currentPoll?.id === pollId) {
          setCurrentPoll(serverPoll);
        }

        return serverPoll;
      } catch (err) {
        // Revert optimistic update on error
        setPolls(polls); // Restore original state
        if (currentPoll?.id === pollId) {
          setCurrentPoll(poll);
        }
        setError(err instanceof Error ? err.message : "Failed to vote on poll");
        throw err;
      }
    },
    [polls, currentPoll]
  );

  const loadPollResults = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getPollResults(id);
      setCurrentPoll(response.data);
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load poll results"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getPollCategories();
      setCategories(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const endPoll = useCallback(
    async (id: string) => {
      return updatePoll(id, { status: PollStatus.ENDED });
    },
    [updatePoll]
  );

  return {
    loading,
    error,
    polls,
    currentPoll,
    categories,
    loadPolls,
    loadPollById,
    loadUserPolls,
    createPoll,
    updatePoll,
    deletePoll,
    voteOnPoll,
    loadPollResults,
    loadCategories,
    endPoll,
  };
}
