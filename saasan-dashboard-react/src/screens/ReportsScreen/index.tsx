import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Search,
  CheckCircle,
  XCircle,
  FileText,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  Activity,
  ArrowUpDown,
  EyeOff,
  Edit,
  Filter,
  X,
  MessageSquare,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  reportPrioritiesApi,
  reportsApi,
  reportStatusesApi,
  reportTypesApi,
  reportVisibilitiesApi,
  messageThreadApi,
} from "@/services/api";
import type { IReport } from "@/types/report";
import ReportEditForm from "@/components/reports/ReportEditForm";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSIONS } from "@/constants/permission.constants";
import { PermissionGate } from "@/components/PermissionGate";
import { Textarea } from "@/components/ui/textarea";
import RenderPagination from "@/components/geography/RenderPagination";

export interface IReportFilter {
  status: string[];
  priority: string[];
  visibility: string[];
  type: string[];
}

const initialFilter: IReportFilter = {
  status: [],
  priority: [],
  visibility: [],
  type: [],
};

const PAGE_SIZE = 10;

export default function ReportsScreen() {
  const { hasPermission } = useAuth();

  const canResolveReports = hasPermission(PERMISSIONS.reports.resolve);
  const canViewMessages = hasPermission(PERMISSIONS.messages.view);
  const canReplyMessages = hasPermission(PERMISSIONS.messages.reply);

  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState(initialFilter);
  const [toApplyFilter, setToApplyFilter] = useState(initialFilter);
  const [showDetails, setShowDetails] = useState<IReport | null>(null);
  const [showActivities, setShowActivities] = useState<string | null>(null);
  const [editingReport, setEditingReport] = useState<IReport | null>(null);
  const [threadReply, setThreadReply] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const queryClient = useQueryClient();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "verified":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["reports", toApplyFilter, currentPage],
    queryFn: () =>
      reportsApi.getAll(toApplyFilter, {
        page: currentPage,
        limit: PAGE_SIZE,
      }),
    enabled: true,
  });

  const { data: typesData } = useQuery({
    queryKey: ["report-types"],
    queryFn: () => reportTypesApi.getAll(),
  });

  const { data: statusesData } = useQuery({
    queryKey: ["report-statuses"],
    queryFn: () => reportStatusesApi.getAll(),
  });

  const { data: prioritiesData } = useQuery({
    queryKey: ["report-priorities"],
    queryFn: () => reportPrioritiesApi.getAll(),
  });

  const { data: visibilitiesData } = useQuery({
    queryKey: ["report-visibilities"],
    queryFn: () => reportVisibilitiesApi.getAll(),
  });

  const filterNames = [
    {
      name: "status",
      text: "Status",
      data: statusesData,
    },
    {
      name: "priority",
      text: "Priority",
      data: prioritiesData,
    },
    {
      name: "visibility",
      text: "Visibility",
      data: visibilitiesData,
    },
    {
      name: "type",
      text: "Type",
      data: typesData,
    },
  ] as Array<{ name: keyof typeof initialFilter; text: string; data: any[] }>;

  // Apply filter function
  const applyFilters = () => {
    setCurrentPage(1);
    setToApplyFilter(filter);
    queryClient.invalidateQueries({ queryKey: ["reports"] });
  };

  // Fetch report activities when showActivities is set
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ["report-activities", showActivities],
    queryFn: () => {
      if (!showActivities)
        return { data: [], page: 1, limit: 50, totalPages: 0, total: 0 };
      return reportsApi.getActivities(showActivities, 1, 50);
    },
    enabled: !!showActivities,
  });

  const { data: reportThreadResponse, isLoading: reportThreadLoading } = useQuery(
    {
      queryKey: ["report-thread-admin", showDetails?.id],
      queryFn: () => messageThreadApi.getByReportId(showDetails!.id),
      enabled:
        !!showDetails?.id &&
        !!showDetails?.autoConvertedToMessage &&
        canViewMessages,
      retry: false,
    },
  );

  const replyToThreadMutation = useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: string;
      content: string;
    }) => messageThreadApi.addReply(messageId, content),
    onSuccess: async () => {
      setThreadReply("");
      await queryClient.invalidateQueries({
        queryKey: ["report-thread-admin", showDetails?.id],
      });
      toast.success("Reply added to thread");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send reply");
    },
  });

  // Reject report mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      reportsApi.updateStatus(id, "rejected", comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report rejected successfully!");
      setShowDetails(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to reject report");
    },
  });

  // Resolve report mutation
  const resolveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      reportsApi.updateStatus(id, "resolved", comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report resolved successfully!");
      setShowDetails(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to resolve report");
    },
  });

  const handleResolve = (id: string) => {
    if (!canResolveReports) {
      toast.error("You do not have permission to manage reports");
      return;
    }

    const comment = prompt("Add a resolution comment:");
    resolveMutation.mutate({ id, comment: comment || undefined });
  };

  const handleApprove = async (report: IReport) => {
    if (!canResolveReports) {
      toast.error("You do not have permission to manage reports");
      return;
    }

    await handleEdit(report);
    setShowDetails(null);
  };

  const handleReject = (id: string) => {
    if (!canResolveReports) {
      toast.error("You do not have permission to manage reports");
      return;
    }

    const comment = prompt("Add a reason for rejection:");
    if (comment) {
      rejectMutation.mutate({ id, comment });
    }
  };

  const handleEdit = async (report: IReport) => {
    if (!canResolveReports) {
      toast.error("You do not have permission to update reports");
      return;
    }

    try {
      // Fetch complete report data before opening form
      const response = await reportsApi.getById(report.id);
      const completeReportData = response;

      setEditingReport(completeReportData);
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Failed to load report data");
    }
  };

  const reports = reportsData?.data || [];
  const total = reportsData?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Review and manage corruption reports</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {filterNames.map(({ name, text, data }) => (
              <div>
                <Label>{text}</Label>
                <MultiSelect
                  options={
                    data?.map((d) => ({
                      label: d.title,
                      value: d.id,
                    })) ?? []
                  }
                  value={filter[name]}
                  onValueChange={(value: string[]) =>
                    setFilter((prev) => ({
                      ...prev,
                      [name]: value || [],
                    }))
                  }
                  popoverClassName="bg-white"
                  placeholder={`Select ${text}`}
                />
              </div>
            ))}
            <div className="flex gap-2">
              <div className="flex items-end">
                <Button
                  onClick={applyFilters}
                  variant="outline"
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setFilter(initialFilter);
                    setCurrentPage(1);
                    setToApplyFilter(initialFilter);
                  }}
                  variant="outline"
                  disabled={Object.values(toApplyFilter).flat(1).length === 0}
                  className="w-full text-white bg-red-600 rounded-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Corruption Reports ({total})</CardTitle>
              <CardDescription>
                Review and manage submitted reports
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No reports found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    report.awaitingPoliticianReply
                      ? "border-amber-300 bg-amber-50/60"
                      : ""
                  }`}
                  onClick={() => setShowDetails(report)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {report.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            report?.sourceCategories?.type
                              ? report?.sourceCategories?.type
                              : "",
                          )}`}
                        >
                          {report?.sourceCategories?.type?.replace("_", " ")}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            report?.sourceCategories?.priority
                              ? report?.sourceCategories?.priority
                              : "",
                          )}`}
                        >
                          {report?.sourceCategories?.priority?.replace(
                            "_",
                            " ",
                          )}
                        </span>
                        {report.awaitingPoliticianReply && (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">
                            Approved, awaiting politician reply
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {report.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {report.district}, {report.municipality}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>
                            {report.isAnonymous ? "Anonymous" : "Named"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>
                            ₹{(report.amountInvolved || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(report);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowActivities(report.id);
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Activity className="h-4 w-4" />
                      </Button>
                      {report?.sourceCategories?.status?.toLowerCase() ===
                        "submitted" && (
                        <>
                          <PermissionGate
                            permission={PERMISSIONS.reports.resolve}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                void handleApprove(report);
                              }}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Review & Approve
                            </Button>
                          </PermissionGate>
                          <PermissionGate
                            permission={PERMISSIONS.reports.resolve}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReject(report.id);
                              }}
                              disabled={rejectMutation.isPending}
                              className="text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </PermissionGate>
                        </>
                      )}
                      {report?.sourceCategories?.status?.toLowerCase() ===
                        "verified" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResolve(report.id);
                          }}
                          disabled={resolveMutation.isPending}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                      {/* Delete button for all reports */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(
                              "Are you sure you want to delete this report?",
                            )
                          ) {
                            // TODO: Implement delete functionality
                            console.log("Delete report:", report.id);
                          }
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {reportsData && reportsData.totalPages > 1 && (
                <RenderPagination
                  currentPage={currentPage}
                  totalPages={reportsData.totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={reportsData.total}
                  pageSize={PAGE_SIZE}
                  itemName="reports"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Details Modal */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDetails(null)}
        >
          <Card
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{showDetails.title}</CardTitle>
                  <CardDescription>
                    Reference: {showDetails.referenceNumber}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      showDetails.sourceCategories?.status
                        ? showDetails.sourceCategories?.status
                        : "",
                    )}`}
                  >
                    {showDetails.sourceCategories?.status?.replace("_", " ")}
                  </span>
                  <button
                    onClick={() => setShowDetails(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors ml-2"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                      showDetails.sourceCategories?.priority
                        ? showDetails.sourceCategories?.priority
                        : "",
                    )}`}
                  >
                    {showDetails.sourceCategories?.priority}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{showDetails.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>District:</strong> {showDetails.district}
                    </p>
                    <p>
                      <strong>Municipality:</strong> {showDetails.municipality}
                    </p>
                    <p>
                      <strong>Ward:</strong> {showDetails.ward}
                    </p>
                    {showDetails.locationDescription && (
                      <p>
                        <strong>Details:</strong>{" "}
                        {showDetails.locationDescription}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Report Details
                  </h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Amount Involved:</strong> ₹
                      {(showDetails.amountInvolved || 0).toLocaleString()}
                    </p>
                    <p>
                      <strong>People Affected:</strong>{" "}
                      {showDetails.peopleAffectedCount || 0}
                    </p>
                    <p>
                      <strong>Date Occurred:</strong>{" "}
                      {showDetails.dateOccurred
                        ? new Date(
                            showDetails.dateOccurred,
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Reporter:</strong>{" "}
                      {showDetails.isAnonymous ? "Anonymous" : "Named"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Engagement</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {showDetails.upvotesCount}
                    </p>
                    <p className="text-sm text-gray-500">Upvotes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {showDetails.downvotesCount}
                    </p>
                    <p className="text-sm text-gray-500">Downvotes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {showDetails.viewsCount}
                    </p>
                    <p className="text-sm text-gray-500">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {showDetails.sharesCount}
                    </p>
                    <p className="text-sm text-gray-500">Shares</p>
                  </div>
                </div>
              </div>

              {showDetails.autoConvertedToMessage && (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-gray-900">
                      Converted Message Thread
                    </h4>
                  </div>
                  {!canViewMessages ? (
                    <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      You do not have permission to monitor message threads.
                    </div>
                  ) : reportThreadLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, index) => (
                        <div
                          key={index}
                          className="h-20 animate-pulse rounded-lg bg-gray-100"
                        />
                      ))}
                    </div>
                  ) : reportThreadResponse?.data ? (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-900">
                        Status: {reportThreadResponse.data.status} • Citizen:{" "}
                        {reportThreadResponse.data.participants.citizen.name ||
                          "Citizen"}{" "}
                        • Politician:{" "}
                        {reportThreadResponse.data.participants.politician.name ||
                          "Representative"}
                      </div>

                      <div className="space-y-3">
                        {reportThreadResponse.data.messages?.map(
                          (message, index) => (
                            <div
                              key={message.id || message._id || index}
                              className={`rounded-lg border p-3 ${
                                message.senderType === "STAFF"
                                  ? "border-purple-100 bg-purple-50/70"
                                  : message.senderType === "POLITICIAN"
                                    ? "border-blue-100 bg-blue-50/70"
                                    : "border-red-100 bg-red-50/70"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-gray-900">
                                  {message.senderType === "STAFF"
                                    ? "Admin / Staff"
                                    : message.senderType === "POLITICIAN"
                                      ? "Politician"
                                      : "Citizen"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {new Date(message.createdAt).toLocaleString()}
                                </p>
                              </div>
                              <p className="mt-2 text-sm text-gray-700">
                                {message.content}
                              </p>
                            </div>
                          ),
                        )}
                      </div>

                      {canReplyMessages && (
                        <div className="space-y-3">
                          <Textarea
                            value={threadReply}
                            onChange={(e) => setThreadReply(e.target.value)}
                            placeholder="Add an admin note or reply into this thread..."
                            className="min-h-[100px]"
                          />
                          <div className="flex justify-end">
                            <Button
                              onClick={() =>
                                replyToThreadMutation.mutate({
                                  messageId: reportThreadResponse.data.id,
                                  content: threadReply.trim(),
                                })
                              }
                              disabled={
                                replyToThreadMutation.isPending ||
                                !threadReply.trim()
                              }
                            >
                              <Send className="mr-2 h-4 w-4" />
                              Reply to Thread
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      No converted thread was found for this report yet.
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDetails(null)}>
                  Close
                </Button>
                {showDetails?.sourceCategories?.status?.toLowerCase() ===
                  "submitted" && (
                  <>
                    <PermissionGate permission={PERMISSIONS.reports.resolve}>
                      <Button
                        onClick={() => void handleApprove(showDetails)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Review & Approve
                      </Button>
                    </PermissionGate>
                    <PermissionGate permission={PERMISSIONS.reports.resolve}>
                      <Button
                        variant="destructive"
                        onClick={() => handleReject(showDetails.id)}
                        disabled={rejectMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </PermissionGate>
                  </>
                )}
                {showDetails?.sourceCategories?.status?.toLowerCase() ===
                  "verified" && (
                  <PermissionGate permission={PERMISSIONS.reports.resolve}>
                    <Button
                      onClick={() => handleResolve(showDetails.id)}
                      disabled={resolveMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Resolve
                    </Button>
                  </PermissionGate>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivities && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowActivities(null)}
        >
          <Card
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Report Activity Log
                  </CardTitle>
                  <CardDescription>
                    Track all changes made to this report
                  </CardDescription>
                </div>
                <button
                  onClick={() => setShowActivities(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {activitiesLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : activitiesData?.data?.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No activities recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activitiesData?.data?.map((activity: any, index: number) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4 py-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">
                              {activity.modifiedBy?.name || "Unknown User"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(activity.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700">
                            {activity.activityType === "status_changed" && (
                              <span>
                                Status changed from{" "}
                                <span className="font-medium">
                                  {activity.oldStatus}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium text-green-600">
                                  {activity.newStatus}
                                </span>
                              </span>
                            )}
                            {activity.activityType === "priority_changed" && (
                              <span>
                                Priority changed from{" "}
                                <span className="font-medium">
                                  {activity.oldPriority}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium text-orange-600">
                                  {activity.newPriority}
                                </span>
                              </span>
                            )}
                            {activity.activityType === "visibility_changed" && (
                              <span>
                                Visibility changed from{" "}
                                <span className="font-medium">
                                  {activity.oldVisibility}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium text-purple-600">
                                  {activity.newVisibility}
                                </span>
                              </span>
                            )}
                            {activity.activityType === "type_changed" && (
                              <span>
                                Type changed from{" "}
                                <span className="font-medium">
                                  {activity.oldType}
                                </span>{" "}
                                to{" "}
                                <span className="font-medium text-blue-600">
                                  {activity.newType}
                                </span>
                              </span>
                            )}
                            {activity.activityType === "report_created" && (
                              <span className="text-green-600">
                                Report created
                              </span>
                            )}
                            {activity.activityType === "report_updated" && (
                              <span className="text-blue-600">
                                Report updated
                              </span>
                            )}
                          </div>
                          {activity.comment && (
                            <div className="mt-2 p-2 bg-gray-100 rounded text-sm text-gray-600">
                              <strong>Comment:</strong> {activity.comment}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          {activity.activityType === "status_changed" && (
                            <ArrowUpDown className="h-4 w-4 text-blue-500" />
                          )}
                          {activity.activityType === "priority_changed" && (
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                          )}
                          {activity.activityType === "visibility_changed" && (
                            <EyeOff className="h-4 w-4 text-purple-500" />
                          )}
                          {activity.activityType === "type_changed" && (
                            <FileText className="h-4 w-4 text-gray-500" />
                          )}
                          {activity.activityType === "report_created" && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {activity.activityType === "report_updated" && (
                            <Edit className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <PermissionGate permission={PERMISSIONS.reports.resolve}>
        {editingReport && (
          <ReportEditForm
            editingReport={editingReport}
            setEditingReport={setEditingReport}
          />
        )}
      </PermissionGate>
    </div>
  );
}
