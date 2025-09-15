import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import {
  Plus,
  Search,
  Upload,
  Edit,
  Trash2,
  AlertTriangle,
  Filter,
  Download,
  CheckCircle,
  Clock,
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
import { majorCasesApi } from "@/services/api";
import { majorCaseSchema, type MajorCaseFormData } from "@/lib/validations";
import type { MajorCase } from "../types/index";

export const MajorCasesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<MajorCase | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MajorCaseFormData>({
    resolver: zodResolver(majorCaseSchema),
  });

  // Fetch major cases
  const { data: casesData, isLoading } = useQuery({
    queryKey: [
      "major-cases",
      {
        search: searchQuery,
        status: selectedStatus,
        priority: selectedPriority,
      },
    ],
    queryFn: () =>
      majorCasesApi.getAll({
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        priority: selectedPriority !== "all" ? selectedPriority : undefined,
        page: 1,
        limit: 50,
      }),
  });

  // Create case mutation
  const createMutation = useMutation({
    mutationFn: majorCasesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["major-cases"] });
      toast.success("Major case created successfully!");
      setShowForm(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create major case"
      );
    },
  });

  // Update case mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<MajorCase> }) =>
      majorCasesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["major-cases"] });
      toast.success("Major case updated successfully!");
      setEditingCase(null);
      setShowForm(false);
      reset();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update major case"
      );
    },
  });

  // Delete case mutation
  const deleteMutation = useMutation({
    mutationFn: majorCasesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["major-cases"] });
      toast.success("Major case deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete major case"
      );
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      majorCasesApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["major-cases"] });
      toast.success("Case status updated successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update case status"
      );
    },
  });

  const handleFormSubmit = (data: MajorCaseFormData) => {
    if (editingCase) {
      updateMutation.mutate({ id: editingCase.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (case_: MajorCase) => {
    setEditingCase(case_);
    reset({
      ...case_,
      assigned_to_officer_id: case_.assigned_to_officer_id || undefined,
      resolved_at: case_.resolved_at || undefined,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this major case?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "unsolved":
        return "bg-red-100 text-red-800";
      case "ongoing":
        return "bg-yellow-100 text-yellow-800";
      case "solved":
        return "bg-green-100 text-green-800";
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

  const cases = casesData?.data || [];
  const total = casesData?.total || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Major Cases</h1>
          <p className="text-gray-600">
            Manage major corruption cases and their status
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowUploadModal(true)}
            disabled={false}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Case
          </Button>
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
                  placeholder="Search cases..."
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
                  <SelectItem value="unsolved">Unsolved</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={selectedPriority}
                onValueChange={setSelectedPriority}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Major Cases ({total})</CardTitle>
              <CardDescription>
                Manage major corruption cases and their progress
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
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
          ) : cases.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No major cases found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cases.map((case_) => (
                <div
                  key={case_.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {case_.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            case_.status
                          )}`}
                        >
                          {case_.status}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                            case_.priority
                          )}`}
                        >
                          {case_.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {case_.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <span>Ref: {case_.referenceNumber}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>
                            ₹{(case_.amountInvolved || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span>{case_.upvotesCount} upvotes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(case_.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(case_)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(case_.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {case_.status !== "solved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(
                              case_.id,
                              case_.status === "unsolved" ? "ongoing" : "solved"
                            )
                          }
                          disabled={updateStatusMutation.isPending}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {case_.status === "unsolved" ? "Start" : "Solve"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowForm(false)}
        >
          <Card
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {editingCase ? "Edit Major Case" : "Add New Major Case"}
                </CardTitle>
                <button
                  onClick={() => setShowForm(false)}
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
              <form
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    rows={3}
                    {...register("description")}
                    className={`w-full px-3 py-2 border rounded-md ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="referenceNumber">Reference Number</Label>
                    <Input
                      id="referenceNumber"
                      {...register("referenceNumber")}
                      className={errors.referenceNumber ? "border-red-500" : ""}
                    />
                    {errors.referenceNumber && (
                      <p className="text-sm text-red-600">
                        {errors.referenceNumber.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="amountInvolved">Amount Involved</Label>
                    <Input
                      id="amountInvolved"
                      type="number"
                      {...register("amountInvolved", { valueAsNumber: true })}
                      className={errors.amountInvolved ? "border-red-500" : ""}
                    />
                    {errors.amountInvolved && (
                      <p className="text-sm text-red-600">
                        {errors.amountInvolved.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select {...register("status")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unsolved">Unsolved</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="solved">Solved</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-sm text-red-600">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select {...register("priority")}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.priority && (
                      <p className="text-sm text-red-600">
                        {errors.priority.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="upvotesCount">Upvotes Count</Label>
                    <Input
                      id="upvotesCount"
                      type="number"
                      {...register("upvotesCount", { valueAsNumber: true })}
                      className={errors.upvotesCount ? "border-red-500" : ""}
                    />
                    {errors.upvotesCount && (
                      <p className="text-sm text-red-600">
                        {errors.upvotesCount.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="peopleAffectedCount">People Affected</Label>
                    <Input
                      id="peopleAffectedCount"
                      type="number"
                      {...register("people_affected_count", {
                        valueAsNumber: true,
                      })}
                      className={
                        errors.people_affected_count ? "border-red-500" : ""
                      }
                    />
                    {errors.people_affected_count && (
                      <p className="text-sm text-red-600">
                        {errors.people_affected_count.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      {...register("district")}
                      className={errors.district ? "border-red-500" : ""}
                    />
                    {errors.district && (
                      <p className="text-sm text-red-600">
                        {errors.district.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="municipality">Municipality</Label>
                    <Input
                      id="municipality"
                      {...register("municipality")}
                      className={errors.municipality ? "border-red-500" : ""}
                    />
                    {errors.municipality && (
                      <p className="text-sm text-red-600">
                        {errors.municipality.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="locationDescription">
                    Location Description
                  </Label>
                  <Input
                    id="locationDescription"
                    {...register("location_description")}
                    className={
                      errors.location_description ? "border-red-500" : ""
                    }
                  />
                  {errors.location_description && (
                    <p className="text-sm text-red-600">
                      {errors.location_description.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false);
                      setEditingCase(null);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : editingCase
                      ? "Update"
                      : "Create"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowUploadModal(false)}
        >
          <Card
            className="w-full max-w-md bg-white border border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Upload Major Cases CSV</CardTitle>
                <button
                  onClick={() => setShowUploadModal(false)}
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
              <CardDescription>
                Upload a CSV file with major cases data. Make sure the file has
                the correct format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csvFile">CSV File</Label>
                  <Input
                    id="csvFile"
                    type="file"
                    accept=".csv"
                    disabled={false}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <p>CSV should include columns:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>title</li>
                    <li>description</li>
                    <li>referenceNumber</li>
                    <li>status</li>
                    <li>priority</li>
                    <li>amountInvolved</li>
                    <li>upvotesCount</li>
                    <li>district</li>
                    <li>municipality</li>
                  </ul>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                    disabled={false}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
