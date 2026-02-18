import { useState, useCallback } from "react";
import { apiService } from "@/services/api";
import type {
  CorruptionReport,
  ReportFilters,
  ReportCreateData,
  ReportUpdateData,
} from "@/types";

export const useReports = (initialFilters?: ReportFilters) => {
  const [allReports, setAllReports] = useState<CorruptionReport[]>([]);
  const [userReports, setUserReports] = useState<CorruptionReport[]>([]);
  const [currentReport, setCurrentReport] = useState<CorruptionReport | null>(
    null,
  );
  const [filters, setFilters] = useState<ReportFilters | undefined>(
    initialFilters,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserReports = useCallback(async () => {
    try {
      const response = await apiService.getUserReports();
      setUserReports(response.data);
    } catch (err) {
      console.error("Error fetching user reports:", err);
    }
  }, []);

  const fetchAllReports = useCallback(async () => {
    try {
      const response = await apiService.getAllReports();
      setAllReports(response.data);
    } catch (err) {
      console.error("Error fetching user reports:", err);
    }
  }, []);

  const fetchReportById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getReportById(id);
      setCurrentReport(response.data);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch report");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReport = useCallback(
    async (data: ReportCreateData, files: File[]) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.createReport(data, files);
        fetchUserReports();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create report",
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateReportStatus = useCallback(
    async (id: string, data: ReportUpdateData) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.updateReportStatus(id, data);
        setAllReports((prev) =>
          prev.map((report) => (report.id === id ? response.data : report)),
        );
        if (currentReport?.id === id) {
          setCurrentReport(response.data);
        }
        return response.data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update report status",
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentReport],
  );

  const updateReport = useCallback(
    async (id: string, data: Partial<ReportCreateData>) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.updateReport(id, data);

        // Update current report if it's the one being edited
        if (currentReport?.id === id) {
          setCurrentReport(response.data);
        }

        // Update reports lists
        setAllReports((prev) =>
          prev.map((report) => (report.id === id ? response.data : report)),
        );
        setUserReports((prev) =>
          prev.map((report) => (report.id === id ? response.data : report)),
        );

        return response.data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update report",
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentReport],
  );

  const deleteEvidence = useCallback(
    async (
      reportId: string,
      evidenceId: string,
      cloudinaryPublicId: string,
    ) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.deleteEvidence(
          reportId,
          evidenceId,
          cloudinaryPublicId,
        );

        // Refresh the report to get updated evidence
        if (currentReport?.id === reportId) {
          await fetchReportById(reportId);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete evidence",
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentReport, fetchReportById],
  );

  const uploadEvidence = useCallback(
    async (id: string, files: File[]) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.uploadEvidence(id, files);
        // Refresh the report to get updated evidence
        if (currentReport?.id === id) {
          await fetchReportById(id);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to upload evidence",
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentReport, fetchReportById],
  );
  const voteOnReport = useCallback(
    async (id: string, isUpvote: boolean) => {
      try {
        await apiService.voteOnReport(id);
        setAllReports((prev) =>
          prev.map((report) =>
            report.id === id
              ? {
                  ...report,
                  upvotesCount: isUpvote
                    ? (report.upvotesCount || 0) + 1
                    : report.upvotesCount || 0,
                  downvotesCount: !isUpvote
                    ? (report.downvotesCount || 0) + 1
                    : report.downvotesCount || 0,
                  userVote: isUpvote ? "up" : "down",
                }
              : report,
          ),
        );
        if (currentReport?.id === id) {
          setCurrentReport((prev: CorruptionReport | null) =>
            prev
              ? {
                  ...prev,
                  upvotesCount: isUpvote
                    ? (prev.upvotesCount || 0) + 1
                    : prev.upvotesCount || 0,
                  downvotesCount: !isUpvote
                    ? (prev.downvotesCount || 0) + 1
                    : prev.downvotesCount || 0,
                  userVote: isUpvote ? "up" : "down",
                }
              : null,
          );
        }
      } catch (err) {
        console.error("Error voting on report:", err);
        throw err;
      }
    },
    [currentReport],
  );

  return {
    allReports,
    userReports,
    currentReport,
    loading,
    error,
    filters,
    setFilters,
    fetchUserReports,
    fetchAllReports,
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
