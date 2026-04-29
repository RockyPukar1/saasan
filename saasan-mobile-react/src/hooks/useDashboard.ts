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

  const myRecentReports = useMemo(() => {
    if (!dashboardData?.data?.myRecentReports?.length) return [];
    return dashboardData.data.myRecentReports.map((item: any) => ({
      id: item._id,
      referenceNumber: item.reference_number,
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      amountInvolved: parseFloat(item.amount_involved) || 0,
      upvotesCount: item.upvotes_count || 0,
      createdAt: item.created_at,
    }));
  }, [dashboardData]);

  const publicReports = useMemo(() => {
    if (!dashboardData?.data?.publicFeed?.recentReports?.length) return [];
    return dashboardData.data.publicFeed.recentReports.map((item: any) => ({
      id: item._id,
      referenceNumber: item.referenceNumber || item.reference_number,
      title: item.title,
      description: item.description,
      status: item.status,
      priority: item.priority,
      amountInvolved: parseFloat(item.amountInvolved || item.amount_involved) || 0,
      upvotesCount: item.upvotesCount || item.upvotes_count || 0,
      createdAt: item.createdAt || item.created_at,
    }));
  }, [dashboardData]);

  const historicalEvents = useMemo(() => {
    const events =
      dashboardData?.data?.publicFeed?.eventsOnThisDay ||
      dashboardData?.data?.publicFeed?.recentEvents ||
      [];
    if (!events.length) return [];
    return events.map((item: any) => ({
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
    myRecentReports,
    publicReports,
    historicalEvents,
    serviceStatus,
    loading,
    error: error instanceof Error ? error.message : error,
    refresh,
  };
};
