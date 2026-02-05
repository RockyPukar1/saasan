import { useState, useCallback, useEffect } from "react";
import { apiService } from "@/services/api";
import type { IConstituency, IDistrict, IMunicipality, IProvince, IWard } from "@/types/location";


export const useLocation = () => {
  const [allProvinces, setAllProvinces] = useState<IProvince[]>([])
  const [districtsByProvinceId, setDistrictsByProvinceId] = useState<IDistrict[]>([]);
  const [constituencyByWardId, setConstituencyByWardId] = useState<IConstituency | null>(null)
  const [municipalitiesByDistrictId, setMunicipalitiesByDistrictId] = useState<IMunicipality[]>([]);
  const [wardsByMunicipalityId, setWardsByMunicipalityId] = useState<IWard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProvinces = useCallback(async () => {
   try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllProvinces();
      setAllProvinces(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch provinces"
      );
      console.error("Error fetching provinces:", err);
    } finally {
      setLoading(false);
    }
  }, [])
  
  const fetchDistrictsByProvinceId = useCallback(async (provinceId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDistrictsByProvinceId(provinceId);
      setDistrictsByProvinceId(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch districts"
      );
      console.error("Error fetching districts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchConstituencyByWardId = useCallback(async(wardId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getConstituencyByWardId(wardId);
      setConstituencyByWardId(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch districts"
      );
      console.error("Error fetching districts:", err);
    } finally {
      setLoading(false);
    }
  }, [])

  const fetchMunicipalitiesByDistrictId = useCallback(async (districtId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getMunicipalitiesByDistrictId(districtId);
      setMunicipalitiesByDistrictId(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch municipalities"
      );
      console.error("Error fetching municipalities:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWardsByMunicipalityId = useCallback(
    async (municipalityId: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getWardsByMunicipalityId(municipalityId);
        setWardsByMunicipalityId(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch wards");
        console.error("Error fetching wards:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchAllProvinces();
  }, [fetchAllProvinces])

  return {
    loading,
    error,

    // data
    allProvinces,
    districtsByProvinceId,
    constituencyByWardId,
    municipalitiesByDistrictId,
    wardsByMunicipalityId,
    
    // constituencyByWardId,
    
    // fetch functions
    fetchAllProvinces,
    fetchDistrictsByProvinceId,
    fetchConstituencyByWardId,
    fetchMunicipalitiesByDistrictId,
    fetchWardsByMunicipalityId,
  };
};
