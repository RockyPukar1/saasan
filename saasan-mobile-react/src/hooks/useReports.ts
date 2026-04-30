import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type {
  ReportFilters,
  ReportCreateData,
  ReportUpdateData,
} from "@/types";
import type { IReport } from "@/types/reports";
import toast from "react-hot-toast";

export const useReports = (initialFilters?: ReportFilters) => {
  const queryClient = useQueryClient();

  const syncReportCaches = useCallback(
    (updatedReport: IReport) => {
      queryClient.setQueryData(["reports", "current", updatedReport.id], updatedReport);
      queryClient.setQueryData(
        ["reports", "all"],
        (oldData: IReport[] | undefined) =>
          Array.isArray(oldData)
            ? oldData.map((report) =>
                report.id === updatedReport.id ? updatedReport : report,
              )
            : oldData,
      );
      queryClient.setQueryData(
        ["reports", "user"],
        (oldData: IReport[] | undefined) =>
          Array.isArray(oldData)
            ? oldData.map((report) =>
                report.id === updatedReport.id ? updatedReport : report,
              )
            : oldData,
      );
    },
    [queryClient],
  );

  const {
    data: allReports = [],
    isLoading: allReportsLoading,
    error: allReportsError,
  } = useQuery({
    queryKey: ["reports", "all"],
    queryFn: () => apiService.getAllReports(),
    staleTime: 3 * 60 * 1000, // 3 minutes
    select: (response) => response.data,
  });

  const {
    data: userReports = [],
    isLoading: userReportsLoading,
    error: userReportsError,
  } = useQuery({
    queryKey: ["reports", "user"],
    queryFn: () => apiService.getUserReports(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (response) => response.data,
  });

  const [currentReportId, setCurrentReportId] = useState<string | undefined>();

  const {
    data: currentReport,
    isLoading: currentReportLoading,
    error: currentReportError,
  } = useQuery({
    queryKey: ["reports", "current", currentReportId],
    queryFn: () => apiService.getReportById(currentReportId || ""),
    enabled: !!currentReportId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (response) => response.data,
  });

  const createReportMutation = useMutation({
    mutationFn: ({ data, files }: { data: ReportCreateData; files: File[] }) =>
      apiService.createReport(data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports", "user"] });
      toast.success("Report created successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create report",
      );
    },
  });

  const updateReportMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ReportCreateData>;
    }) => apiService.updateReport(id, data),
    onSuccess: (response) => {
      syncReportCaches(response.data);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update report",
      );
    },
  });

  const updateReportStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReportUpdateData }) =>
      apiService.updateReportStatus(id, data),
    onSuccess: (response) => {
      syncReportCaches(response.data);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report status updated successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update report status",
      );
    },
  });

  const uploadEvidenceMutation = useMutation({
    mutationFn: ({ id, files }: { id: string; files: File[] }) =>
      apiService.uploadEvidence(id, files),
    onSuccess: () => {
      // Invalidate all report queries to refresh evidence
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Evidence uploaded successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload evidence",
      );
    },
  });

  const deleteEvidenceMutation = useMutation({
    mutationFn: ({
      reportId,
      evidenceId,
      cloudinaryPublicId,
    }: {
      reportId: string;
      evidenceId: string;
      cloudinaryPublicId: string;
    }) => apiService.deleteEvidence(reportId, evidenceId, cloudinaryPublicId),
    onSuccess: () => {
      // Invalidate all report queries to refresh evidence
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Evidence deleted successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete evidence",
      );
    },
  });

  const voteOnReportMutation = useMutation({
    mutationFn: ({
      id,
      direction,
    }: {
      id: string;
      direction: "up" | "down";
    }) => apiService.voteOnReport(id, direction),
    onSuccess: async (response, variables) => {
      syncReportCaches(response.data);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["reports", "current", variables.id],
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: ["reports", "all"],
          exact: true,
        }),
        queryClient.invalidateQueries({
          queryKey: ["reports", "user"],
          exact: true,
        }),
      ]);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to vote on report",
      );
    },
  });

  const createReport = useCallback(
    async (data: ReportCreateData, files: File[]) => {
      return createReportMutation.mutateAsync({ data, files });
    },
    [createReportMutation],
  );

  const updateReport = useCallback(
    async (id: string, data: Partial<ReportCreateData>) => {
      return updateReportMutation.mutateAsync({ id, data });
    },
    [updateReportMutation],
  );

  const updateReportStatus = useCallback(
    async (id: string, data: ReportUpdateData) => {
      return updateReportStatusMutation.mutateAsync({ id, data });
    },
    [updateReportStatusMutation],
  );

  const uploadEvidence = useCallback(
    async (id: string, files: File[]) => {
      return uploadEvidenceMutation.mutateAsync({ id, files });
    },
    [uploadEvidenceMutation],
  );

  const deleteEvidence = useCallback(
    async (
      reportId: string,
      evidenceId: string,
      cloudinaryPublicId: string,
    ) => {
      return deleteEvidenceMutation.mutateAsync({
        reportId,
        evidenceId,
        cloudinaryPublicId,
      });
    },
    [deleteEvidenceMutation],
  );

  const voteOnReport = useCallback(
    async (id: string, direction: "up" | "down") => {
      return voteOnReportMutation.mutateAsync({ id, direction });
    },
    [voteOnReportMutation],
  );

  const fetchReportById = useCallback(
    async (id: string) => {
      setCurrentReportId(id);
      return queryClient.fetchQuery({
        queryKey: ["reports", "current", id],
        queryFn: () => apiService.getReportById(id),
      });
    },
    [queryClient],
  );

  const loading =
    allReportsLoading ||
    userReportsLoading ||
    currentReportLoading ||
    createReportMutation.isPending ||
    updateReportMutation.isPending ||
    updateReportStatusMutation.isPending ||
    uploadEvidenceMutation.isPending ||
    deleteEvidenceMutation.isPending;

  const error =
    allReportsError ||
    userReportsError ||
    currentReportError ||
    createReportMutation.error ||
    updateReportMutation.error ||
    updateReportStatusMutation.error ||
    uploadEvidenceMutation.error ||
    deleteEvidenceMutation.error ||
    voteOnReportMutation.error;

  return {
    allReports,
    userReports,
    currentReport,
    loading,
    error: error instanceof Error ? error.message : null,
    filters: initialFilters,
    setFilters: () => {},
    fetchUserReports: () =>
      queryClient.invalidateQueries({ queryKey: ["reports", "user"] }),
    fetchAllReports: () =>
      queryClient.invalidateQueries({ queryKey: ["reports", "all"] }),
    fetchReportById,
    createReport,
    updateReport,
    updateReportStatus,
    voteOnReport,
    uploadEvidence,
    deleteEvidence,
    getReport: fetchReportById,
  };
};
