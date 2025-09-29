import { useState, useCallback, useEffect } from "react";
import { apiService } from "~/services/api";
import type {
  CorruptionReport,
  ReportFilters,
  ReportCreateData,
  ReportUpdateData,
  Evidence,
} from "~/shared-types";
import type { MediaPickerResult } from "~/shared-types";

export const useReports = (initialFilters?: ReportFilters) => {
  const [reports, setReports] = useState<CorruptionReport[]>([]);
  const [userReports, setUserReports] = useState<CorruptionReport[]>([]);
  const [currentReport, setCurrentReport] = useState<CorruptionReport | null>(
    null
  );
  const [filters, setFilters] = useState<ReportFilters | undefined>(
    initialFilters
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllReports(filters);
      setReports(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reports");
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchUserReports = useCallback(async () => {
    try {
      const response = await apiService.getUserReports();
      setUserReports(response.data);
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

  const createReport = useCallback(async (data: ReportCreateData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.createReport(data);
      setReports((prev) => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create report");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReportStatus = useCallback(
    async (id: string, data: ReportUpdateData) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.updateReportStatus(id, data);
        setReports((prev) =>
          prev.map((report) => (report.id === id ? response.data : report))
        );
        if (currentReport?.id === id) {
          setCurrentReport(response.data);
        }
        return response.data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update report status"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentReport]
  );

  const uploadEvidence = useCallback(
    async (reportId: string, file: MediaPickerResult) => {
      try {
        setLoading(true);
        setError(null);

        // Create FormData
        const formData = new FormData();

        if ("uri" in file) {
          // Handle ImagePicker result
          formData.append("evidence", {
            uri: file.uri,
            type: (file as any).type || "image/jpeg",
            name: (file as any).fileName || "photo.jpg",
          } as any);
        } else if ("assets" in file) {
          // Handle DocumentPicker result
          const asset = (file as any).assets[0];
          formData.append("evidence", {
            uri: asset.uri,
            type: asset.mimeType || "application/octet-stream",
            name: asset.name || "document",
          } as any);
        }

        const response = await apiService.uploadEvidence(
          reportId,
          formData as any
        );

        if (currentReport?.id === reportId) {
          setCurrentReport((prev) =>
            prev
              ? {
                  ...prev,
                  evidence: [...(prev.evidence || []), ...response.data],
                }
              : null
          );
        }
        return response.data;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to upload evidence"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [currentReport]
  );

  const voteOnReport = useCallback(
    async (id: string, isUpvote: boolean) => {
      try {
        await apiService.voteOnReport(id);
        setReports((prev) =>
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
                  user_vote: isUpvote ? "up" : "down",
                }
              : report
          )
        );
        if (currentReport?.id === id) {
          setCurrentReport((prev) =>
            prev
              ? {
                  ...prev,
                  upvotes_count: isUpvote
                    ? (prev.upvotesCount || 0) + 1
                    : prev.upvotesCount || 0,
                  downvotes_count: !isUpvote
                    ? (prev.downvotesCount || 0) + 1
                    : prev.downvotesCount || 0,
                  user_vote: isUpvote ? "up" : "down",
                }
              : null
          );
        }
      } catch (err) {
        console.error("Error voting on report:", err);
        throw err;
      }
    },
    [currentReport]
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    fetchUserReports();
  }, [fetchUserReports]);

  return {
    reports,
    userReports,
    currentReport,
    loading,
    error,
    filters,
    setFilters,
    fetchReports,
    fetchUserReports,
    fetchReportById,
    createReport,
    updateReportStatus,
    uploadEvidence,
    voteOnReport,
    getReport: fetchReportById,
  };
};
