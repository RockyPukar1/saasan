import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Filter,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
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
import { Textarea } from "@/components/ui/textarea";
import { majorCasesApi } from "@/services/api";
import { majorCaseSchema, type MajorCaseFormData } from "@/lib/validations";
import type { IMajorCase } from "@/types/case";

const DEFAULT_FORM_VALUES: MajorCaseFormData = {
  title: "",
  description: "",
  status: "unsolved",
  priority: "medium",
  amountInvolved: 0,
  dateOccurred: new Date().toISOString().slice(0, 10),
  peopleAffectedCount: 0,
  locationDescription: "",
  isPublic: true,
};

export const MajorCasesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingCase, setEditingCase] = useState<IMajorCase | null>(null);

  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MajorCaseFormData>({
    resolver: zodResolver(majorCaseSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    if (!showForm) {
      reset(DEFAULT_FORM_VALUES);
      setEditingCase(null);
    }
  }, [reset, showForm]);

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
        search: searchQuery || undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        priority: selectedPriority !== "all" ? selectedPriority : undefined,
        page: 1,
        limit: 50,
      }),
  });

  const createMutation = useMutation({
    mutationFn: majorCasesApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["major-cases"] });
      toast.success("Major case created successfully");
      setShowForm(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create major case",
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<IMajorCase> }) =>
      majorCasesApi.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["major-cases"] });
      toast.success("Major case updated successfully");
      setShowForm(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update major case",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: majorCasesApi.delete,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["major-cases"] });
      toast.success("Major case deleted successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete major case",
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      majorCasesApi.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["major-cases"] });
      toast.success("Case status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update case status",
      );
    },
  });

  const handleFormSubmit = (data: MajorCaseFormData) => {
    if (editingCase) {
      updateMutation.mutate({ id: editingCase.id, data });
      return;
    }

    createMutation.mutate(data);
  };

  const handleEdit = (caseRecord: IMajorCase) => {
    setEditingCase(caseRecord);
    reset({
      title: caseRecord.title,
      description: caseRecord.description,
      status: caseRecord.status,
      priority: caseRecord.priority,
      amountInvolved: caseRecord.amountInvolved || 0,
      dateOccurred:
        caseRecord.dateOccurred?.slice(0, 10) ||
        new Date().toISOString().slice(0, 10),
      peopleAffectedCount: caseRecord.peopleAffectedCount || 0,
      locationDescription: caseRecord.locationDescription || "",
      provinceId: caseRecord.provinceId || "",
      districtId: caseRecord.districtId || "",
      constituencyId: caseRecord.constituencyId || "",
      municipalityId: caseRecord.municipalityId || "",
      wardId: caseRecord.wardId || "",
      isPublic: caseRecord.isPublic,
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Major Cases</h1>
          <p className="text-gray-600">
            Track high-impact cases from intake through resolution
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCase(null);
            reset(DEFAULT_FORM_VALUES);
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Case
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search title, reference, location..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
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
                  <SelectItem value="all">All Statuses</SelectItem>
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
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedStatus("all");
                  setSelectedPriority("all");
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Major Cases ({total})</CardTitle>
          <CardDescription>
            Review case progress, financial scope, and public visibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-24 animate-pulse rounded bg-gray-200" />
              ))}
            </div>
          ) : cases.length === 0 ? (
            <div className="py-8 text-center">
              <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">No major cases found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cases.map((caseRecord) => (
                <div
                  key={caseRecord.id}
                  className="rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {caseRecord.title}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                            caseRecord.status,
                          )}`}
                        >
                          {caseRecord.status}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
                            caseRecord.priority,
                          )}`}
                        >
                          {caseRecord.priority}
                        </span>
                        {!caseRecord.isPublic && (
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                            Private
                          </span>
                        )}
                      </div>

                      <p className="mb-3 line-clamp-2 text-sm text-gray-600">
                        {caseRecord.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span>Ref: {caseRecord.referenceNumber}</span>
                        <span>Rs. {caseRecord.amountInvolved.toLocaleString()}</span>
                        <span>{caseRecord.peopleAffectedCount} affected</span>
                        <span>{caseRecord.upvotesCount} upvotes</span>
                        {caseRecord.dateOccurred && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(caseRecord.dateOccurred).toLocaleDateString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(caseRecord.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {caseRecord.locationDescription && (
                        <div className="mt-3 flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                          <span>{caseRecord.locationDescription}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(caseRecord)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(caseRecord.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      {caseRecord.status !== "solved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusUpdate(
                              caseRecord.id,
                              caseRecord.status === "unsolved"
                                ? "ongoing"
                                : "solved",
                            )
                          }
                          disabled={updateStatusMutation.isPending}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          {caseRecord.status === "unsolved" ? "Start" : "Solve"}
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

      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setShowForm(false)}
        >
          <Card
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-gray-200 bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {editingCase ? "Edit Major Case" : "Add Major Case"}
                  </CardTitle>
                  <CardDescription>
                    Capture the core details the backend already supports
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowForm(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
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
                    <p className="text-sm text-red-600">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    {...register("description")}
                    className={errors.description ? "border-red-500" : ""}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label>Status</Label>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unsolved">Unsolved</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                            <SelectItem value="solved">Solved</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.status && (
                      <p className="text-sm text-red-600">
                        {errors.status.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Controller
                      control={control}
                      name="priority"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
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
                      )}
                    />
                    {errors.priority && (
                      <p className="text-sm text-red-600">
                        {errors.priority.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="amountInvolved">Amount Involved</Label>
                    <Input
                      id="amountInvolved"
                      type="number"
                      min="0"
                      step="0.01"
                      {...register("amountInvolved", { valueAsNumber: true })}
                      className={errors.amountInvolved ? "border-red-500" : ""}
                    />
                    {errors.amountInvolved && (
                      <p className="text-sm text-red-600">
                        {errors.amountInvolved.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="peopleAffectedCount">People Affected</Label>
                    <Input
                      id="peopleAffectedCount"
                      type="number"
                      min="0"
                      {...register("peopleAffectedCount", {
                        valueAsNumber: true,
                      })}
                      className={
                        errors.peopleAffectedCount ? "border-red-500" : ""
                      }
                    />
                    {errors.peopleAffectedCount && (
                      <p className="text-sm text-red-600">
                        {errors.peopleAffectedCount.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="dateOccurred">Date Occurred</Label>
                    <Input
                      id="dateOccurred"
                      type="date"
                      {...register("dateOccurred")}
                      className={errors.dateOccurred ? "border-red-500" : ""}
                    />
                    {errors.dateOccurred && (
                      <p className="text-sm text-red-600">
                        {errors.dateOccurred.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <input
                      id="isPublic"
                      type="checkbox"
                      {...register("isPublic")}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="isPublic">Visible publicly</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="locationDescription">Location Description</Label>
                  <Textarea
                    id="locationDescription"
                    rows={3}
                    {...register("locationDescription")}
                    className={errors.locationDescription ? "border-red-500" : ""}
                  />
                  {errors.locationDescription && (
                    <p className="text-sm text-red-600">
                      {errors.locationDescription.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                  >
                    {editingCase ? "Save Changes" : "Create Case"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
