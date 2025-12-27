import { useState, useCallback, useEffect } from "react";
import { apiService } from "~/services/api";

interface Post {
  level: string;
  position: string;
}

export interface Politician {
  id: string;
  name: string;
  posts: Post[];
  party: string;
  constituency: string;
  rating: number;
  totalVotes: number;
  promisesFulfilled: number;
  totalPromises: number;
  avatar?: string;
  trends: "up" | "down" | "stable";
}

export interface GovernmentLevel {
  id: string;
  name: string;
  description: string;
  count: number;
}

export const usePoliticians = (initialLevel: string = "federal") => {
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [governmentLevels, setGovernmentLevels] = useState<GovernmentLevel[]>(
    []
  );
  const [selectedLevel, setSelectedLevel] = useState(initialLevel);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoliticians = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use lowercase level names for consistency
      const response = await apiService.getPoliticians(selectedLevel);

      if (response.success && response.data) {
        // Transform backend data to frontend format
        const transformedPoliticians = response.data.map((politician: any) => ({
          id: politician._id,
          name: politician.fullName,
          posts: politician.posts,
          party: politician.partyName ?? "Independent",
          constituency: politician.constituencyNumber,
          rating: politician.rating || 0,
          totalVotes:
            politician.total_votes_received || politician.totalVotes || 0,
          promisesFulfilled: politician.promisesFulfilled || 0,
          totalPromises: politician.totalPromises || 0,
          avatar: politician.profile_image_url || politician.avatar,
          trends: politician.trends || "stable",
        }));

        setPoliticians(transformedPoliticians);
      } else {
        setPoliticians([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch politicians"
      );
      console.error("Error fetching politicians:", err);
      setPoliticians([]);
    } finally {
      setLoading(false);
    }
  }, [selectedLevel]);

  const fetchGovernmentLevels = useCallback(async () => {
    try {
      const response = await apiService.getGovernmentLevels();
      if (response.success && response.data) {
        // Transform backend data to frontend format
        const transformedLevels = response.data.map((level: any) => ({
          id: level.id,
          name: level.name.toLowerCase(),
          description: level.description,
          count: level.count || 0,
        }));
        setGovernmentLevels(transformedLevels);
      } else {
        setGovernmentLevels([]);
      }
    } catch (err) {
      console.error("Error fetching government levels:", err);
      setGovernmentLevels([]);
    }
  }, []);

  useEffect(() => {
    fetchPoliticians();
  }, [fetchPoliticians]);

  useEffect(() => {
    fetchGovernmentLevels();
  }, [fetchGovernmentLevels]);

  return {
    politicians,
    governmentLevels,
    selectedLevel,
    setSelectedLevel,
    loading,
    error,
    refresh: fetchPoliticians,
  };
};
