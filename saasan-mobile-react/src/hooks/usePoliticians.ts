import { useCallback, useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type {
  IGovernmentLevel,
  IParty,
  IPolitician,
  IPoliticianFilter,
  IPosition,
} from "@/types/politics";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;
const EMPTY_FILTER: IPoliticianFilter = {
  level: [],
  position: [],
  party: [],
};

const mapPolitician = (politician: IPolitician) => ({
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
});

export const usePoliticians = () => {
  const queryClient = useQueryClient();
  const [currentFilter, setCurrentFilter] = useState<IPoliticianFilter | null>(
    null,
  );
  const [currentCursor, setCurrentCursor] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [allPoliticians, setAllPoliticians] = useState<IPolitician[]>([]);

  // Government Levels Query - Long cache as this data rarely changes
  const {
    data: governmentLevelsData,
    isLoading: governmentLevelsLoading,
    error: governmentLevelsError,
  } = useQuery({
    queryKey: ["politicians", "government-levels"],
    queryFn: () => apiService.getGovernmentLevels(),
    staleTime: 60 * 60 * 1000, // 1 hour
    select: (response) => {
      if (response.success && response.data) {
        return response.data.map((level: IGovernmentLevel) => ({
          id: level.id,
          name: level.name.toLowerCase(),
          description: level.description,
          count: level.count || 0,
        }));
      }
      return [];
    },
  });

  // Parties Query - Medium cache
  const {
    data: partiesData,
    isLoading: partiesLoading,
    error: partiesError,
  } = useQuery({
    queryKey: ["politicians", "parties"],
    queryFn: () => apiService.getParties(),
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (response) => {
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
      return [];
    },
  });

  // Positions Query - Long cache as positions rarely change
  const {
    data: positionsData,
    isLoading: positionsLoading,
    error: positionsError,
  } = useQuery({
    queryKey: ["politicians", "positions"],
    queryFn: () => apiService.getPositions(),
    staleTime: 60 * 60 * 1000, // 1 hour
    select: (response) => {
      if (response.success && response.data) {
        return response.data.map((position: IPosition) => ({
          id: position.id,
          name: position.name,
          description: position.description,
          count: position.count,
          abbreviation: position.abbreviation,
        }));
      }
      return [];
    },
  });

  // Politicians by Filter Query - Medium cache
  const {
    data: politiciansData,
    isLoading: politiciansLoading,
    isFetching: politiciansFetching,
    error: politiciansError,
  } = useQuery({
    queryKey: ["politicians", "list", currentFilter, currentCursor],
    queryFn: () =>
      apiService.getPoliticiansByFilter({
        ...(currentFilter || EMPTY_FILTER),
        ...(currentCursor ? { cursor: currentCursor } : {}),
        limit: PAGE_SIZE,
      }),
    enabled: currentFilter !== null,
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (response) => {
      const items = response.success && response.data
        ? response.data.map(mapPolitician)
        : [];

      return {
        items,
        pagination: response.meta?.pagination,
      };
    },
  });

  useEffect(() => {
    if (!politiciansData) {
      return;
    }

    setAllPoliticians((previousPoliticians) => {
      if (!currentCursor) {
        return politiciansData.items;
      }

      const existingIds = new Set(
        previousPoliticians.map((politician) => politician.id),
      );
      const nextPagePoliticians = politiciansData.items.filter(
        (politician) => !existingIds.has(politician.id),
      );

      return [...previousPoliticians, ...nextPagePoliticians];
    });
    setNextCursor(politiciansData.pagination?.nextCursor ?? null);
  }, [currentCursor, politiciansData]);

  useEffect(() => {
    if (politiciansError && allPoliticians.length > 0) {
      toast.error(
        politiciansError instanceof Error
          ? politiciansError.message
          : "Failed to load more politicians",
      );
    }
  }, [allPoliticians.length, politiciansError]);

  const governmentLevels = useMemo(
    () => governmentLevelsData || [],
    [governmentLevelsData],
  );
  const parties = useMemo(() => partiesData || [], [partiesData]);
  const positions = useMemo(() => positionsData || [], [positionsData]);
  const politicians = useMemo(() => allPoliticians, [allPoliticians]);

  const pagination = politiciansData?.pagination;
  const hasMore = useMemo(() => {
    if (!pagination) {
      return false;
    }

    return Boolean(pagination.hasNext && nextCursor);
  }, [nextCursor, pagination]);
  const loadingMore = politiciansFetching && currentCursor !== null;

  const loading =
    governmentLevelsLoading ||
    partiesLoading ||
    positionsLoading ||
    (politiciansLoading && politicians.length === 0);
  const error =
    governmentLevelsError ||
    partiesError ||
    positionsError ||
    (politicians.length === 0 ? politiciansError : null);

  const fetchPoliticianById = async (politicianId: string) => {
    try {
      const response = await queryClient.fetchQuery({
        queryKey: ["politicians", "detail", politicianId],
        queryFn: () => apiService.getPoliticianById(politicianId),
        staleTime: 15 * 60 * 1000, // 15 minutes
      });
      return response.data || null;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to fetch politician",
      );
      return null;
    }
  };

  const fetchPoliticiansByParty = useCallback(
    async (partyId: string) => {
      try {
        const response = await queryClient.fetchQuery({
          queryKey: ["politicians", "by-party", partyId],
          queryFn: () => apiService.getPoliticiansByParty(partyId),
          staleTime: 10 * 60 * 1000, // 10 minutes
        });

        if (response.success && response.data) {
          return response.data.map(mapPolitician);
        }
        return [];
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : "Failed to fetch politicians by party",
        );
        return [];
      }
    },
    [queryClient],
  );

  const fetchPoliticians = useCallback(async (filter: IPoliticianFilter) => {
    setAllPoliticians([]);
    setCurrentCursor(null);
    setNextCursor(null);
    setCurrentFilter(filter);
  }, []);

  const refresh = useCallback(() => {
    setAllPoliticians([]);
    setCurrentCursor(null);
    setNextCursor(null);
    queryClient.invalidateQueries({ queryKey: ["politicians"] });
  }, [queryClient]);

  const loadAllPoliticians = useCallback(() => {
    setAllPoliticians([]);
    setCurrentCursor(null);
    setNextCursor(null);
    setCurrentFilter({
      level: [],
      position: [],
      party: [],
    });
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || politiciansFetching || !nextCursor) {
      return;
    }

    setCurrentCursor(nextCursor);
  }, [hasMore, nextCursor, politiciansFetching]);

  return {
    politicians,
    governmentLevels,
    parties,
    positions,
    loading,
    error: error instanceof Error ? error.message : null,
    refresh,
    fetchPoliticianById,
    fetchPoliticiansByParty,
    fetchPoliticians,
    loadAllPoliticians,
    loadMore,
    hasMore,
    loadingMore,
  };
};
