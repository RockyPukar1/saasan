import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type { IParty } from "@/types/politics";

export function useParties() {
  // Parties Query - Medium cache with fallback to mock data
  const {
    data: partiesData,
    isLoading: loading,
    error,
    refetch: refresh,
  } = useQuery({
    queryKey: ["parties"],
    queryFn: async () => {
      try {
        const response = await apiService.getParties();
        if (response.success && response.data) {
          return response.data.map((party: IParty) => ({
            id: party.id,
            name: party.name,
            abbreviation: party.abbreviation,
            ideology: party.ideology || "",
            foundedIn: party.foundedIn,
            logoUrl: party.logoUrl,
            color: party.color || "",
            count: party.count || 0,
          }));
        }
        // Fallback to empty array if API fails
        return [];
      } catch (err) {
        // Fallback to empty array on error
        return [];
      }
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
  });

  const parties = partiesData || [];

  return {
    parties,
    loading,
    error: error instanceof Error ? error.message : null,
    refresh,
  };
}
