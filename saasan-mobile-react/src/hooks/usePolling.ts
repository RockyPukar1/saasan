import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type { Poll, PollFilters } from "@/types";
import toast from "react-hot-toast";

export function usePolling() {
  const queryClient = useQueryClient();
  const [currentVotingPollId, setCurrentVotingPollId] = useState<string>("");

  // Polls Query - Short cache as polls can change frequently
  const {
    data: polls = [],
    isLoading: loading,
    error,
    refetch: refetchPolls,
  } = useQuery({
    queryKey: ["polls"],
    queryFn: () => apiService.getAllPolls(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection time (v5 uses gcTime instead of cacheTime)
    retry: 2,
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnReconnect: true, // Refetch on reconnect
  });

  // Vote on Poll Mutation
  const voteMutation = useMutation({
    mutationFn: async ({
      pollId,
      optionId,
    }: {
      pollId: string;
      optionId: string | string[];
    }) => {
      setCurrentVotingPollId(pollId);
      await apiService.voteOnPoll(pollId, optionId);

      // Fetch updated poll data
      const updatedPollResponse = await apiService.getPollById(pollId);
      return { pollId, updatedPoll: updatedPollResponse.data };
    },
    onSuccess: ({ pollId, updatedPoll }) => {
      // Update the polls array with fresh data
      queryClient.setQueryData(["polls"], (oldPolls: Poll[] | undefined) => {
        if (!oldPolls) return oldPolls;
        return oldPolls.map((poll) =>
          poll.id === pollId ? updatedPoll : poll,
        );
      });

      // Update individual poll cache
      queryClient.setQueryData(["poll", pollId], updatedPoll);

      // Invalidate to ensure fresh data from server
      queryClient.invalidateQueries({ queryKey: ["polls"] });

      toast.success("Vote recorded successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to vote on poll",
      );
    },
    onSettled: () => {
      setCurrentVotingPollId("");
    },
  });

  const voteOnPoll = useCallback(
    async (pollId: string, optionId: string | string[]) => {
      return voteMutation.mutateAsync({ pollId, optionId });
    },
    [voteMutation],
  );

  const loadPollsWithFilters = useCallback(
    async (filters?: PollFilters) => {
      return queryClient.fetchQuery({
        queryKey: ["polls", filters],
        queryFn: () => apiService.getAllPolls(filters),
        staleTime: 2 * 60 * 1000,
      });
    },
    [queryClient],
  );

  const loadPolls = useCallback(() => {
    return refetchPolls();
  }, [refetchPolls]);

  return {
    loading: loading || voteMutation.isPending,
    currentVotingPollId,
    error: error instanceof Error ? error.message : null,
    polls,
    loadPolls,
    loadPollsWithFilters,
    voteOnPoll,
  };
}
