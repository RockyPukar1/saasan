import { useState, useCallback, useEffect } from "react";
import { apiService } from "@/services/api";
import type { IGovernmentLevel, IParty, IPolitician, IPoliticianFilter, IPosition } from "@/types/politician";


export const usePoliticians = () => {
  const [politicians, setPoliticians] = useState<IPolitician[]>([]);
  const [governmentLevels, setGovernmentLevels] = useState<IGovernmentLevel[]>(
    []
  );
  const [parties, setParties] = useState<IParty[]>([]);
  const [positions, setPositions] = useState<IPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            experienceYears: politician.experienceYears,
            party: politician.isIndependent ? "Independent" : politician.party,
            constituency: politician.constituencyNumber,
            rating: politician.rating || 0,
            createdAt: politician.createdAt,
            updatedAt: politician.updatedAt,
            isIndependent: politician.isIndependent,
            totalReports: politician.totalReports,
            verifiedReports: politician.verifiedReports,
            sourceCategories: politician.sourceCategories,
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
          (level: IGovernmentLevel) => ({
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
