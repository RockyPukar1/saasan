import { useState, useCallback } from "react";
import { apiService } from "~/services/api";
import {
  Poll,
  PollFilters,
  CreatePollData,
  UpdatePollData,
  PollStatus,
} from "~/shared-types";

export function usePolling() {
  const [loading, setLoading] = useState(false);
  const [votingLoading, setVotingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

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
        setPolls((prev) => prev.filter((poll) => poll._id !== id));
        if (currentPoll?._id === id) {
          setCurrentPoll(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete poll");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentPoll?._id]
  );

  const voteOnPoll = useCallback(
    async (pollId: string, optionId: string | string[]) => {
      setError(null);
      setVotingLoading(true);

      try {
        // Make API call first
        await apiService.voteOnPoll(pollId, optionId);

        // Then reload the specific poll to get accurate server data
        const response = await apiService.getPollById(pollId);
        const updatedPoll = response.data;

        // Update the polls array with the fresh data
        setPolls((prevPolls) =>
          prevPolls.map((poll) => (poll._id === pollId ? updatedPoll : poll))
        );

        // Update current poll if it's the same
        if (currentPoll?._id === pollId) {
          setCurrentPoll(updatedPoll);
        }

        return updatedPoll;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to vote on poll");
        throw err;
      } finally {
        setVotingLoading(false);
      }
    },
    [currentPoll]
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
    votingLoading,
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
