import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
export const useLocation = () => {
  const queryClient = useQueryClient();

  // Provinces Query - Long cache as location data rarely changes
  const {
    data: allProvincesData,
    isLoading: provincesLoading,
    error: provincesError,
  } = useQuery({
    queryKey: ["location", "provinces"],
    queryFn: () => apiService.getAllProvinces(),
    staleTime: 60 * 60 * 1000, // 1 hour
    select: (response) => response.data,
  });

  // Districts by Province Query - Medium cache
  const {
    data: allDistrictsData,
    isLoading: districtsLoading,
    error: districtsError,
  } = useQuery({
    queryKey: ["location", "districts"],
    queryFn: () => apiService.getDistrictsByProvinceId(""),
    enabled: false, // Only enable when provinceId is provided
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (response) => response.data,
  });

  // Constituency by Ward Query - Medium cache
  const {
    data: allConstituencyData,
    isLoading: constituencyLoading,
    error: constituencyError,
  } = useQuery({
    queryKey: ["location", "constituency"],
    queryFn: () => apiService.getConstituencyByWardId(""),
    enabled: false, // Only enable when wardId is provided
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (response) => response.data,
  });

  // Municipalities by District Query - Medium cache
  const {
    data: allMunicipalitiesData,
    isLoading: municipalitiesLoading,
    error: municipalitiesError,
  } = useQuery({
    queryKey: ["location", "municipalities"],
    queryFn: () => apiService.getMunicipalitiesByDistrictId(""),
    enabled: false, // Only enable when districtId is provided
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (response) => response.data,
  });

  // Wards by Municipality Query - Medium cache
  const {
    data: allWardsData,
    isLoading: wardsLoading,
    error: wardsError,
  } = useQuery({
    queryKey: ["location", "wards"],
    queryFn: () => apiService.getWardsByMunicipalityId(""),
    enabled: false, // Only enable when municipalityId is provided
    staleTime: 30 * 60 * 1000, // 30 minutes
    select: (response) => response.data,
  });

  const loading =
    provincesLoading ||
    districtsLoading ||
    constituencyLoading ||
    municipalitiesLoading ||
    wardsLoading;
  const error =
    provincesError ||
    districtsError ||
    constituencyError ||
    municipalitiesError ||
    wardsError;

  const fetchDistrictsByProvinceId = useCallback(
    async (provinceId: string) => {
      const response = await queryClient.fetchQuery({
        queryKey: ["location", "districts", provinceId],
        queryFn: () => apiService.getDistrictsByProvinceId(provinceId),
        staleTime: 30 * 60 * 1000,
      });
      return response.data;
    },
    [queryClient],
  );

  const fetchConstituencyByWardId = useCallback(
    async (wardId: string) => {
      const response = await queryClient.fetchQuery({
        queryKey: ["location", "constituency", wardId],
        queryFn: () => apiService.getConstituencyByWardId(wardId),
        staleTime: 30 * 60 * 1000,
      });
      return response.data;
    },
    [queryClient],
  );

  const fetchMunicipalitiesByDistrictId = useCallback(
    async (districtId: string) => {
      const response = await queryClient.fetchQuery({
        queryKey: ["location", "municipalities", districtId],
        queryFn: () => apiService.getMunicipalitiesByDistrictId(districtId),
        staleTime: 30 * 60 * 1000,
      });
      return response.data;
    },
    [queryClient],
  );

  const fetchWardsByMunicipalityId = useCallback(
    async (municipalityId: string) => {
      const response = await queryClient.fetchQuery({
        queryKey: ["location", "wards", municipalityId],
        queryFn: () => apiService.getWardsByMunicipalityId(municipalityId),
        staleTime: 30 * 60 * 1000,
      });
      return response.data;
    },
    [queryClient],
  );

  const fetchAllProvinces = useCallback(() => {
    return queryClient.invalidateQueries({
      queryKey: ["location", "provinces"],
    });
  }, [queryClient]);

  return {
    loading,
    error: error instanceof Error ? error.message : null,

    // data
    allProvincesData,
    allDistrictsData,
    allConstituencyData,
    allMunicipalitiesData,
    allWardsData,

    // fetch functions
    fetchAllProvinces,
    fetchDistrictsByProvinceId,
    fetchConstituencyByWardId,
    fetchMunicipalitiesByDistrictId,
    fetchWardsByMunicipalityId,
  };
};
