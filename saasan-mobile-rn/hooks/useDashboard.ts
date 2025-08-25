import { useCallback, useEffect, useState } from "react";
import { apiService } from "~/services/mock";
import { DashboardStats, MajorCase, ServiceStatus } from "~/types/dashboard";

export const useDashboard = () => {
  const [dashboardStats, setDashboardStats] =
    useState<Partial<DashboardStats> | null>(null);
  const [majorCases, setMajorCases] = useState<MajorCase[]>([]);
  const [serviceStatus, setServiceStatus] = useState<Partial<ServiceStatus>[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, casesResponse, servicesResponse] =
        await Promise.all([
          apiService.getDashboardStats(),
          apiService.getMajorCases(),
          apiService.getLiveServices(),
        ]);
      if (statsResponse.success) {
        setDashboardStats(statsResponse.data);
      }

      if (casesResponse.success) {
        setMajorCases(casesResponse.data);
      }

      if (servicesResponse.success) {
        setServiceStatus(servicesResponse.data);
      }
    } catch (err: any) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dashboard data"
      );
      console.log("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();

    // set up periodic refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  return {
    dashboardStats,
    majorCases,
    serviceStatus,
    loading,
    error,
    refresh: fetchDashboardData,
  };
};
