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
      setLoading(true);
      setError(null);
      try {
        await apiService.voteOnPoll(pollId, optionId);
        // Reload poll to get updated results
        const response = await apiService.getPollResults(pollId);
        setCurrentPoll(response.data);
        return response.data;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to vote on poll");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
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
