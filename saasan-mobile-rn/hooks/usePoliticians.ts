import { useState, useCallback, useEffect } from "react";
import { PoliticianFilter } from "~/app/(tabs)/politicians";
import { apiService } from "~/services/api";

interface Post {
  level: string;
  position: string;
}

export interface Politician {
  id: string;
  fullName: string;
  party: string;
  experienceYears: number;
  createdAt: Date;
  updatedAt: Date;
  isIndependent: boolean;
  rating: number;
  totalReports: number;
  verifiedReports: number;
  constituencyNumber?: string;
}

export interface GovernmentLevel {
  id: string;
  name: string;
  description: string;
  count: number;
}

export interface Party {
  id: string;
  name: string;
  abbreviation: string;
  ideology?: string;
  foundedIn: Date;
  logoUrl?: string;
  color: string;
  count: number;
}
export interface Position {
  id: string;
  title: string;
  description: string;
  abbreviation: string;
  count: number;
}

export const usePoliticians = () => {
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [governmentLevels, setGovernmentLevels] = useState<GovernmentLevel[]>(
    []
  );
  const [parties, setParties] = useState<Party[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoliticians = async (filter: PoliticianFilter) => {
    try {
      setLoading(true);
      setError(null);
      // Use lowercase level names for consistency
      const response = await apiService.getPoliticiansByFilter(filter);

      if (response.success && response.data) {
        // Transform backend data to frontend format
        const transformedPoliticians = response.data.map(
          (politician: Politician) => ({
            id: politician.id,
            fullName: politician.fullName,
            experienceYears: politician.experienceYears,
            party: politician.isIndependent ? "Independent" : politician.party,
            constituency: politician.constituencyNumber,
            rating: politician.rating || 0,
            createdAt: politician.createdAt,
            updatedAt: politician.updatedAt,
            isIndependent: politician.isIndependent,
            totalReports: politician.totalReports,
            verifiedReports: politician.verifiedReports,
          })
        );

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
  };

  const fetchGovernmentLevels = useCallback(async () => {
    try {
      const response = await apiService.getGovernmentLevels();
      if (response.success && response.data) {
        // Transform backend data to frontend format
        const transformedLevels = response.data.map(
          (level: GovernmentLevel) => ({
            id: level.id,
            name: level.name.toLowerCase(),
            description: level.description,
            count: level.count || 0,
          })
        );
        setGovernmentLevels(transformedLevels);
      } else {
        setGovernmentLevels([]);
      }
    } catch (err) {
      console.error("Error fetching government levels:", err);
      setGovernmentLevels([]);
    }
  }, []);

  const fetchParties = useCallback(async () => {
    try {
      const response = await apiService.getParties();
      if (response.success && response.data) {
        // Transform backend data to frontend format
        const transformedParties = response.data.map((party: Party) => ({
          id: party.id,
          name: party.name,
          abbreviation: party.abbreviation,
          ideology: party.ideology || "",
          foundedIn: party.foundedIn,
          logoUrl: party.logoUrl,
          color: party.color || "",
          count: party.count || 0,
        }));
        setParties(transformedParties);
      } else {
        setParties([]);
      }
    } catch (err) {
      console.error("Error fetching parties:", err);
      setParties([]);
    }
  }, []);

  const fetchPositions = useCallback(async () => {
    try {
      const response = await apiService.getPositions();
      if (response.success && response.data) {
        // Transform backend data to frontend format
        const transformedPositions = response.data.map(
          (position: Position) => ({
            id: position.id,
            title: position.title,
            description: position.description,
            count: position.count,
            abbreviation: position.abbreviation,
          })
        );
        setPositions(transformedPositions);
      } else {
        setPositions([]);
      }
    } catch (err) {
      console.error("Error fetching positions:", err);
      setParties([]);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
    fetchParties();
    fetchGovernmentLevels();
  }, [fetchPositions, fetchParties, fetchGovernmentLevels]);

  return {
    politicians,
    governmentLevels,
    parties,
    positions,
    loading,
    error,
    refresh: fetchPoliticians,
  };
};
