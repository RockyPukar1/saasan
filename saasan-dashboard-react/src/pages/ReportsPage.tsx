import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { reportsApi } from "@/services/api";
import type { CorruptionReport } from "../../../shared/types/reports";

export const ReportsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [showDetails, setShowDetails] = useState<CorruptionReport | null>(null);

  const queryClient = useQueryClient();

  // Fetch reports
  const { data: reportsData, isLoading } = useQuery({
    queryKey: [
      "reports",
      {
        search: searchQuery,
        status: selectedStatus,
        category: selectedCategory,
        district: selectedDistrict,
      },
    ],
    queryFn: () =>
      reportsApi.getAll({
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        district: selectedDistrict !== "all" ? selectedDistrict : undefined,
        page: 1,
        limit: 50,
      }),
  });

  // Approve report mutation
  const approveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      reportsApi.approve(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report approved successfully!");
      setShowDetails(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve report");
    },
  });

  // Reject report mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment?: string }) =>
      reportsApi.reject(id, comment),
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
      reportsApi.resolve(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report resolved successfully!");
      setShowDetails(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to resolve report");
    },
  });

  const handleApprove = (id: string) => {
    const comment = prompt("Add a comment (optional):");
    approveMutation.mutate({ id, comment: comment || undefined });
  };

  const handleReject = (id: string) => {
    const comment = prompt("Add a reason for rejection:");
    if (comment) {
      rejectMutation.mutate({ id, comment });
    }
  };

  const handleResolve = (id: string) => {
    const comment = prompt("Add a resolution comment:");
    resolveMutation.mutate({ id, comment: comment || undefined });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "verified":
        return "bg-green-100 text-green-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "dismissed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
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
            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="dismissed">Dismissed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="corruption">Corruption</SelectItem>
                  <SelectItem value="abuse_of_power">Abuse of Power</SelectItem>
                  <SelectItem value="favoritism">Favoritism</SelectItem>
                  <SelectItem value="nepotism">Nepotism</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>District</Label>
              <Select
                value={selectedDistrict}
                onValueChange={setSelectedDistrict}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  <SelectItem value="kathmandu">Kathmandu</SelectItem>
                  <SelectItem value="lalitpur">Lalitpur</SelectItem>
                  <SelectItem value="bhaktapur">Bhaktapur</SelectItem>
                </SelectContent>
              </Select>
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
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
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
                            report.status
                          )}`}
                        >
                          {report.status.replace("_", " ")}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            report.priority
                          )}`}
                        >
                          {report.priority}
                        </span>
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
                          setShowDetails(report);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {report.status === "submitted" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(report.id);
                            }}
                            disabled={approveMutation.isPending}
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
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
                        </>
                      )}
                      {report.status === "verified" && (
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
                              "Are you sure you want to delete this report?"
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
                      showDetails.status
                    )}`}
                  >
                    {showDetails.status.replace("_", " ")}
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
                      showDetails.priority
                    )}`}
                  >
                    {showDetails.priority}
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
                            showDetails.dateOccurred
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

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDetails(null)}>
                  Close
                </Button>
                {showDetails.status === "submitted" && (
                  <>
                    <Button
                      onClick={() => handleApprove(showDetails.id)}
                      disabled={approveMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(showDetails.id)}
                      disabled={rejectMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                {showDetails.status === "verified" && (
                  <Button
                    onClick={() => handleResolve(showDetails.id)}
                    disabled={resolveMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Resolve
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
