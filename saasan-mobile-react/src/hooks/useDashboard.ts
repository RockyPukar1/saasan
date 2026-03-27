import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";

export const useDashboard = () => {
  const {
    data: dashboardData,
    isLoading: loading,
    error,
    refetch: refresh,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiService.getDashboardStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes for dashboard data
    retry: 2,
  });

  const dashboardStats = useMemo(
    () => dashboardData?.data || null,
    [dashboardData],
  );

  const majorCases = useMemo(() => {
    if (!dashboardData?.data?.recentCases.length) return [];
    return dashboardData.data.recentCases.map((item: any) => ({
      id: item._id,
      referenceNumber: item.reference_number,
      title: item.title,
      description: item.description,
      status: (item.status === "verified"
        ? "ongoing"
        : item.status === "resolved"
          ? "solved"
          : "unsolved") as "unsolved" | "ongoing" | "solved",
      priority: item.priority,
      amountInvolved: parseFloat(item.amount_involved) || 0,
      upvotesCount: item.upvotes_count || 0,
      createdAt: item.created_at,
    }));
  }, [dashboardData]);

  const historicalEvents = useMemo(() => {
    if (!dashboardData?.data?.recentEvents) return [];
    return dashboardData.data.recentEvents.map((item: any) => ({
      id: item._id,
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      referenceNumber: item.referenceNumber,
      amountInvolved: parseFloat(item.amount_involved) || 0,
      upvotesCount: item.upvotes_count || 0,
      createdAt: item.created_at,
    }));
  }, [dashboardData]);

  const serviceStatus: any[] = [];

  return {
    dashboardStats,
    majorCases,
    historicalEvents,
    serviceStatus,
    loading,
    error: error instanceof Error ? error.message : error,
    refresh,
  };
};
