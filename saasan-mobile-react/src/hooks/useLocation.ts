import { useState, useCallback, useEffect } from "react";
import { apiService } from "@/services/api";

interface District {
  id: string;
  name: string;
}

interface Municipality {
  id: string;
  name: string;
}

export const useLocation = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [wards, setWards] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDistricts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDistricts();
      setDistricts(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch districts"
      );
      console.error("Error fetching districts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMunicipalities = useCallback(async (districtId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getMunicipalities(districtId);
      setMunicipalities(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch municipalities"
      );
      console.error("Error fetching municipalities:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWards = useCallback(
    async (districtId: string, municipalityId: string) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getWards(districtId, municipalityId);
        setWards(response.data);
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
    fetchDistricts();
  }, [fetchDistricts]);

  return {
    districts,
    municipalities,
    wards,
    loading,
    error,
    fetchMunicipalities,
    fetchWards,
  };
};
