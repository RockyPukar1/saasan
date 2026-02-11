import { useState, useCallback, useEffect } from "react";
import { apiService } from "@/services/api";
import type {
  IGovernmentLevel,
  IParty,
  IPolitician,
  IPoliticianFilter,
  IPosition,
} from "@/types/politics";

export const usePoliticians = () => {
  const [politicians, setPoliticians] = useState<IPolitician[]>([]);
  const [governmentLevels, setGovernmentLevels] = useState<IGovernmentLevel[]>(
    [],
  );
  const [parties, setParties] = useState<IParty[]>([]);
  const [positions, setPositions] = useState<IPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoliticianById = async (politicianId: string) => {
    let data: IPolitician | null = null;
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getPoliticianById(politicianId);
      data = response.data || [];
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch politician",
      );
      console.error("Error fetching politician:", error);
    } finally {
      setLoading(false);
    }
    return data;
  };

  const fetchPoliticians = async (filter: IPoliticianFilter) => {
    try {
      setLoading(true);
      setError(null);
      // Use lowercase level names for consistency
      const response = await apiService.getPoliticiansByFilter(filter);

      if (response.success && response.data) {
        // Transform backend data to frontend format
        const transformedPoliticians = response.data.map(
          (politician: IPolitician) => ({
            id: politician.id,
            fullName: politician.fullName,
            biography: politician.biography,
            contact: politician.contact,
            socialMedia: politician.socialMedia,
            education: politician.education,
            experienceYears: politician.experienceYears,
            profession: politician.profession,
            party: politician.isIndependent
              ? "Independent"
              : politician.sourceCategories?.party || "",
            rating: politician.rating || 0,
            totalVotes: politician.totalVotes,
            totalReports: politician.totalReports,
            verifiedReports: politician.verifiedReports,
            isIndependent: politician.isIndependent,
            sourceCategories: politician.sourceCategories,
            promises: politician.promises || [],
            achievements: politician.achievements || [],
            createdAt: politician.createdAt,
            updatedAt: politician.updatedAt,
          }),
        );

        setPoliticians(transformedPoliticians);
      } else {
        setPoliticians([]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch politicians",
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
          (level: IGovernmentLevel) => ({
            id: level.id,
            name: level.name.toLowerCase(),
            description: level.description,
            count: level.count || 0,
          }),
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
        const transformedParties = response.data.map((party: IParty) => ({
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
          (position: IPosition) => ({
            id: position.id,
            name: position.name,
            description: position.description,
            count: position.count,
            abbreviation: position.abbreviation,
          }),
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
    fetchPoliticianById,
  };
};
