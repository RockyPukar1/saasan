import { useState, useCallback } from "react";
import { pollingApi } from "../services/api";
import type {
  Poll,
  PollFilters,
  CreatePollData,
  UpdatePollData,
  PollAnalytics,
} from "../../../shared/types/polling";

export function usePolling() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [polls, setPolls] = useState<Poll[]>([]);
  const [currentPoll, setCurrentPoll] = useState<Poll | null>(null);
  const [analytics, setAnalytics] = useState<PollAnalytics | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);

  const loadPolls = useCallback(async (filters?: PollFilters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pollingApi.getAll(filters);
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
      const response = await pollingApi.getById(id);
      setCurrentPoll(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load poll");
    } finally {
      setLoading(false);
    }
  }, []);

  const createPoll = useCallback(async (data: CreatePollData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pollingApi.create(data);
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
      const response = await pollingApi.update(id, data);
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
        await pollingApi.delete(id);
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

  const voteOnPoll = useCallback(async (pollId: string, optionId: string) => {
    setLoading(true);
    setError(null);
    try {
      await pollingApi.vote(pollId, optionId);
      // Reload poll to get updated results
      const response = await pollingApi.getById(pollId);
      setCurrentPoll(response.data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to vote on poll");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addPollOption = useCallback(async (pollId: string, option: string) => {
    setLoading(true);
    setError(null);
    try {
      await pollingApi.addOption(pollId, { option });
      // Reload poll to get updated options
      const response = await pollingApi.getById(pollId);
      setCurrentPoll(response.data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add option");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pollingApi.getAnalytics();
      setAnalytics(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPoliticianComparison = useCallback(async (politicianId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pollingApi.getPoliticianComparison(politicianId);
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load politician comparison"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPartyComparison = useCallback(async (partyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pollingApi.getPartyComparison(partyId);
      return response.data;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load party comparison"
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
      const response = await pollingApi.getCategories();
      setCategories(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load categories"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStatuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pollingApi.getStatuses();
      setStatuses(response.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await pollingApi.getTypes();
      setTypes(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load types");
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(
    async (name: string, name_nepali?: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await pollingApi.createCategory({ name, name_nepali });
        // Add the new category to the local state immediately
        setCategories((prev) => {
          const newCategory = response.data.name;
          if (!prev.includes(newCategory)) {
            return [...prev, newCategory];
          }
          return prev;
        });
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || "Failed to create category");
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createType = useCallback(async (name: string, name_nepali?: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await pollingApi.createType({ name, name_nepali });
      // Add the new type to the local state immediately
      setTypes((prev) => {
        const newType = response.data.name;
        if (!prev.includes(newType)) {
          return [...prev, newType];
        }
        return prev;
      });
      return response.data;
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to create type");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const endPoll = useCallback(
    async (id: string) => {
      return updatePoll(id, { status: "ended" });
    },
    [updatePoll]
  );

  return {
    loading,
    error,
    polls,
    currentPoll,
    analytics,
    categories,
    statuses,
    types,
    loadPolls,
    loadPollById,
    createPoll,
    updatePoll,
    deletePoll,
    voteOnPoll,
    addPollOption,
    loadAnalytics,
    loadPoliticianComparison,
    loadPartyComparison,
    loadCategories,
    loadStatuses,
    loadTypes,
    createCategory,
    createType,
    endPoll,
  };
}
