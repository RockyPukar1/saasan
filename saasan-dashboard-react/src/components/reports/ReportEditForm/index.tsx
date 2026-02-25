import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  reportsApi,
  reportStatusesApi,
  reportPrioritiesApi,
  reportVisibilitiesApi,
  reportTypesApi,
} from "@/services/api";
import { Save, X, AlertTriangle, Flag, Eye, FileText } from "lucide-react";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import type { IReport } from "@/types/reports";

interface IReportEditForm {
  editingReport: IReport | null;
  setEditingReport: (report: IReport | null) => void;
}

const reportSchema = z.object({
  statusId: z.string().optional(),
  priorityId: z.string().optional(),
  visibilityId: z.string().optional(),
  typeId: z.string().optional(),
  comment: z.string().min(1, "Comment is required"),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function ReportEditForm({
  editingReport,
  setEditingReport,
}: IReportEditForm) {
  const { confirm } = useConfirmDialog();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [changedFields, setChangedFields] = useState<Set<string>>(new Set());

  // Fetch filter options from backend
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

  const { data: typesData } = useQuery({
    queryKey: ["report-types"],
    queryFn: () => reportTypesApi.getAll(),
  });

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<ReportFormData>({
    defaultValues: {
      statusId: editingReport?.statusId ?? "",
      priorityId: editingReport?.priorityId ?? "",
      visibilityId: editingReport?.visibilityId ?? "",
      typeId: editingReport?.typeId ?? "",
      comment: editingReport?.comment ?? "",
    },
    resolver: zodResolver(reportSchema),
  });

  // useEffect(() => {
  //   if (
  //     editingReport &&
  //     statusesData &&
  //     prioritiesData &&
  //     visibilitiesData &&
  //     typesData
  //   )
  //     return;

  //   reset({
  //     statusId: editingReport?.statusId ?? "",
  //     priorityId: editingReport?.priorityId ?? "",
  //     visibilityId: editingReport?.visibilityId ?? "",
  //     typeId: editingReport?.typeId ?? "",
  //     comment: "",
  //   });
  // }, [
  //   editingReport,
  //   reset,
  //   statusesData,
  //   prioritiesData,
  //   visibilitiesData,
  //   typesData,
  // ]);

  console.log(watch());

  const queryClient = useQueryClient();

  const handleEvidenceClick = (evidence: any) => {
    if (evidence.fileType === "image") {
      // Images: Open directly in new tab
      window.open(evidence.filePath, "_blank");
    } else if (evidence.originalName.toLowerCase().endsWith(".pdf")) {
      // PDFs: Try direct browser view first, fallback to Google Docs
      window.open(evidence.filePath, "_blank");
    } else {
      // Other documents: Use Google Docs viewer
      const viewerUrl = `https://docs.google.com/gview?embedded=1&url=${encodeURIComponent(evidence.filePath)}`;
      window.open(viewerUrl, "_blank");
    }
  };

  const updateReportMutation = useMutation({
    mutationFn: async (data: ReportFormData) => {
      if (!editingReport) return;

      return await reportsApi.adminUpdateReport(editingReport.id, {
        statusId: data.statusId || undefined,
        priorityId: data.priorityId || undefined,
        visibilityId: data.visibilityId || undefined,
        typeId: data.typeId || undefined,
        comment: data.comment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success("Report updated successfully!");
      setEditingReport(null);
      setHasUnsavedChanges(false);
      setChangedFields(new Set());
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update report");
    },
  });

  const onSubmit = async (data: ReportFormData) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", errors);
    console.log("Changed fields:", changedFields);

    if (changedFields.size === 0) {
      toast("No changes to save");
      return;
    }

    updateReportMutation.mutate(data);
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      confirm({
        title: "Discard Changes",
        description: "Are you sure you want to discard your changes?",
        variant: "destructive",
        confirmText: "Discard",
        onConfirm: () => {
          setEditingReport(null);
          setHasUnsavedChanges(false);
          setChangedFields(new Set());
        },
      });
    } else {
      setEditingReport(null);
    }
  };

  return (
    <>
      {editingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Save className="h-5 w-5 mr-2" />
                    Edit Report: {editingReport.referenceNumber}
                  </CardTitle>
                  <CardDescription>
                    Update report properties and track changes
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Report Information - Left Column */}
                  <div className="lg:col-span-1 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Report Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Title
                          </Label>
                          <p className="text-sm mt-1">{editingReport.title}</p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Description
                          </Label>
                          <p className="text-sm mt-1 line-clamp-3">
                            {editingReport.description}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Reference Number
                          </Label>
                          <p className="text-sm mt-1 font-mono">
                            {editingReport.referenceNumber}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Created
                          </Label>
                          <p className="text-sm mt-1">
                            {new Date(
                              editingReport.createdAt,
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              editingReport.createdAt,
                            ).toLocaleTimeString()}
                          </p>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Last Updated
                          </Label>
                          <p className="text-sm mt-1">
                            {new Date(
                              editingReport.updatedAt,
                            ).toLocaleDateString()}{" "}
                            at{" "}
                            {new Date(
                              editingReport.updatedAt,
                            ).toLocaleTimeString()}
                          </p>
                        </div>

                        {editingReport.district && (
                          <div>
                            <Label className="text-sm font-medium text-gray-500">
                              Location
                            </Label>
                            <p className="text-sm mt-1">
                              {editingReport.district}
                            </p>
                          </div>
                        )}

                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Anonymous
                          </Label>
                          <p className="text-sm mt-1">
                            {editingReport.isAnonymous ? "Yes" : "No"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Evidence Section */}
                    {editingReport.evidences &&
                      editingReport.evidences.length > 0 && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <FileText className="h-5 w-5 mr-2" />
                              Evidence Files ({editingReport.evidences.length})
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {editingReport.evidences.map((evidence) => (
                                <div
                                  key={evidence.id}
                                  className="group relative aspect-square bg-gray-50 border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                                  onClick={() => handleEvidenceClick(evidence)}
                                >
                                  {/* Image Thumbnail or File Icon */}
                                  {evidence.fileType === "image" ? (
                                    <img
                                      src={evidence.filePath}
                                      alt={evidence.originalName}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        // Fallback to icon if image fails to load
                                        e.currentTarget.style.display = "none";
                                        e.currentTarget.nextElementSibling?.classList.remove(
                                          "hidden",
                                        );
                                      }}
                                    />
                                  ) : null}

                                  {/* Fallback Icon for non-images or failed image loads */}
                                  <div
                                    className={`${evidence.fileType === "image" ? "hidden" : ""} absolute inset-0 flex items-center justify-center bg-gray-100`}
                                  >
                                    <FileText className="h-8 w-8 text-gray-400" />
                                  </div>

                                  {/* Overlay with file info */}
                                  <div className="absolute inset-0 from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute bottom-0 left-0 right-0 p-2">
                                      <p className="text-white text-xs font-medium truncate">
                                        {evidence.originalName}
                                      </p>
                                      <p className="text-white/80 text-xs">
                                        {evidence.fileType}
                                      </p>
                                    </div>
                                  </div>

                                  {/* View Button Overlay */}
                                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      className="h-6 w-6 p-0 bg-white/90 hover:bg-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEvidenceClick(evidence);
                                      }}
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* File List Below Grid */}
                            <div className="mt-4 space-y-2">
                              {editingReport.evidences.map((evidence) => (
                                <div
                                  key={evidence.id}
                                  className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded"
                                >
                                  <span className="font-medium truncate max-w-[200px]">
                                    {evidence.originalName}
                                  </span>
                                  <span className="text-gray-500">
                                    {new Date(
                                      evidence.uploadedAt,
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                  </div>

                  {/* Edit Form - Right Columns */}
                  <CardContent className="lg:col-span-2">
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status */}
                        <div className="space-y-2">
                          <Label htmlFor="statusId">Status</Label>
                          <Controller
                            control={control}
                            name="statusId"
                            render={({ field }) => (
                              <Select
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {statusesData?.map((status) => (
                                    <SelectItem
                                      key={status.id}
                                      value={status.id}
                                    >
                                      {status.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        {/* Priority */}
                        <div className="space-y-2">
                          <Label htmlFor="priorityId">Priority</Label>
                          <Controller
                            control={control}
                            name="priorityId"
                            render={({ field }) => (
                              <Select
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {prioritiesData?.map((priority) => (
                                    <SelectItem
                                      key={priority.id}
                                      value={priority.id}
                                    >
                                      {priority.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        {/* Visibility */}
                        <div className="space-y-2">
                          <Label htmlFor="visibilityId">Visibility</Label>
                          <Controller
                            control={control}
                            name="visibilityId"
                            render={({ field }) => (
                              <Select
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select visibility" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {visibilitiesData?.map((visibility) => (
                                    <SelectItem
                                      key={visibility.id}
                                      value={visibility.id}
                                    >
                                      {visibility.title}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        {/* Report Type */}
                        <div className="space-y-2">
                          <Label htmlFor="typeId">Report Type</Label>
                          <Controller
                            control={control}
                            name="typeId"
                            render={({ field }) => (
                              <Select
                                value={field.value ?? ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                  {typesData?.map((type) => (
                                    <SelectItem key={type.id} value={type.id}>
                                      <div className="flex items-center">
                                        <Flag className="h-3 w-3 mr-2" />
                                        {type.title}
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>

                        {/* Comment */}
                        <div className="space-y-2">
                          <Label htmlFor="comment">Comment *</Label>
                          <Textarea
                            {...register("comment")}
                            placeholder="Add a comment explaining the changes..."
                            rows={3}
                          />
                          {errors.comment && (
                            <p className="text-sm text-red-600">
                              {errors.comment.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Changed Fields Indicator */}
                    {changedFields.size > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center text-sm text-blue-800">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          <span className="font-medium">
                            Changes detected:{" "}
                            {Array.from(changedFields).join(", ")}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="flex justify-between mt-4">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={updateReportMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={
                          updateReportMutation.isPending ||
                          changedFields.size === 0
                        }
                      >
                        {updateReportMutation.isPending ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-gray-900 border-t-transparent border-l-transparent mr-2"></div>
                            Saving...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </div>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
