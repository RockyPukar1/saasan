import { useEffect, useMemo, useState } from "react";
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
  politicsApi,
  messageThreadApi,
} from "@/services/api";
import {
  Save,
  X,
  Flag,
  Eye,
  FileText,
  CheckCircle,
  MessageSquare,
  Send,
} from "lucide-react";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import type { IReport } from "@/types/report";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAuth } from "@/contexts/AuthContext";
import { PERMISSIONS } from "@/constants/permission.constants";

interface IReportEditForm {
  editingReport: IReport | null;
  setEditingReport: (report: IReport | null) => void;
}

const reportSchema = z.object({
  statusId: z.string().optional(),
  priorityId: z.string().optional(),
  visibilityId: z.string().optional(),
  typeId: z.string().optional(),
  comment: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

export default function ReportEditForm({
  editingReport,
  setEditingReport,
}: IReportEditForm) {
  const { confirm } = useConfirmDialog();
  const { hasPermission } = useAuth();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [selectedPoliticianIds, setSelectedPoliticianIds] = useState<string[]>(
    editingReport?.assignedPoliticianIds || [],
  );
  const [threadReply, setThreadReply] = useState("");

  const canViewMessages = hasPermission(PERMISSIONS.messages.view);
  const canReplyMessages = hasPermission(PERMISSIONS.messages.reply);

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

  const { data: politiciansResponse } = useQuery({
    queryKey: ["politicians-approval-options"],
    queryFn: () => politicsApi.getAll(undefined, { page: 1, limit: 100 }),
  });

  const { data: approvalSuggestionsResponse } = useQuery({
    queryKey: ["report-approval-suggestions", editingReport?.id],
    queryFn: () => reportsApi.getApprovalSuggestions(editingReport!.id),
    enabled: !!editingReport?.id,
  });

  const { data: reportThreadResponse, isLoading: reportThreadLoading } =
    useQuery({
      queryKey: ["report-thread-edit", editingReport?.id],
      queryFn: () => messageThreadApi.getByReportId(editingReport!.id),
      enabled:
        !!editingReport?.id &&
        !!editingReport?.autoConvertedToMessage &&
        canViewMessages,
      retry: false,
    });

  const {
    register,
    handleSubmit,
    control,
    getValues,
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

  const politicianOptions = useMemo(
    () =>
      (politiciansResponse?.data || []).map((politician) => ({
        label: politician.fullName,
        value: politician.id,
      })),
    [politiciansResponse],
  );

  useEffect(() => {
    if (!editingReport) {
      return;
    }

    const suggestedIds =
      approvalSuggestionsResponse?.data?.suggestedPoliticians?.map(
        (politician) => politician.id,
      ) || [];

    const nextIds =
      editingReport.assignedPoliticianIds?.length
        ? editingReport.assignedPoliticianIds
        : suggestedIds;

    setSelectedPoliticianIds(nextIds);
  }, [approvalSuggestionsResponse, editingReport]);

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
      new Set();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update report");
    },
  });

  // Approve report mutation
  const approveMutation = useMutation({
    mutationFn: ({
      id,
      politicianIds,
      comment,
    }: {
      id: string;
      politicianIds: string[];
      comment?: string;
    }) => reportsApi.approve(id, politicianIds, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      toast.success(
        "Report approved successfully! Message thread created for politician.",
      );
      setEditingReport(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to approve report");
    },
  });

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
        queryKey: ["report-thread-edit", editingReport?.id],
      });
      toast.success("Reply added to thread");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to send reply");
    },
  });

  const onSubmit = async (data: ReportFormData) => {
    updateReportMutation.mutate(data);
  };

  const handleApprove = () => {
    if (!editingReport) return;
    if (!selectedPoliticianIds.length) {
      toast.error("Select at least one politician before approving");
      return;
    }

    approveMutation.mutate({
      id: editingReport.id,
      politicianIds: selectedPoliticianIds,
      comment: getValues("comment") || undefined,
    });
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
          new Set();
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

                    {editingReport.autoConvertedToMessage && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <MessageSquare className="mr-2 h-5 w-5" />
                            Converted Message Thread
                          </CardTitle>
                          <CardDescription>
                            Review the linked citizen-politician thread without
                            leaving report editing.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {!canViewMessages ? (
                            <div className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
                              You do not have permission to view message
                              threads.
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
                                Status: {reportThreadResponse.data.status} •
                                Citizen:{" "}
                                {reportThreadResponse.data.participants.citizen
                                  .name || "Citizen"}{" "}
                                • Politician:{" "}
                                {reportThreadResponse.data.participants
                                  .politician.name || "Representative"}
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
                                            : message.senderType ===
                                                "POLITICIAN"
                                              ? "Politician"
                                              : "Citizen"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {new Date(
                                            message.createdAt,
                                          ).toLocaleString()}
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
                                    onChange={(e) =>
                                      setThreadReply(e.target.value)
                                    }
                                    placeholder="Add an admin note or reply into this thread..."
                                    className="min-h-[100px]"
                                  />
                                  <div className="flex justify-end">
                                    <Button
                                      type="button"
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
                          <Label htmlFor="comment">Comment</Label>
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

                        <div className="space-y-2">
                          <Label>Politicians For Approval</Label>
                          <MultiSelect
                            options={politicianOptions}
                            onValueChange={(value) => {
                              setSelectedPoliticianIds(value);
                              setHasUnsavedChanges(true);
                            }}
                            defaultValue={selectedPoliticianIds}
                            placeholder="Search and assign politicians"
                            searchable={true}
                            singleLine={false}
                            hideSelectAll={false}
                            resetOnDefaultValueChange={true}
                          />
                          <p className="text-xs text-gray-500">
                            Auto-selected politicians are matched from the report
                            jurisdiction. You can add or remove politicians
                            before approval.
                          </p>
                          {!approvalSuggestionsResponse?.data
                            ?.hasJurisdictionPolitician && (
                            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                              No politician was auto-selected for this
                              jurisdiction. Choose one or more politicians
                              manually before approving.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={
                            updateReportMutation.isPending ||
                            approveMutation.isPending
                          }
                        >
                          Cancel
                        </Button>
                        {editingReport.sourceCategories?.status?.toLowerCase() !==
                          "approved" && (
                          <Button
                            variant="default"
                            onClick={handleApprove}
                            disabled={
                              updateReportMutation.isPending ||
                              approveMutation.isPending ||
                              !selectedPoliticianIds.length
                            }
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {approveMutation.isPending ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-r-2 border-white border-t-transparent border-l-transparent mr-2"></div>
                                Approving...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Report
                              </div>
                            )}
                          </Button>
                        )}
                      </div>
                      <Button
                        type="submit"
                        disabled={
                          updateReportMutation.isPending ||
                          approveMutation.isPending
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

                    {/* Activity Logs */}
                    {editingReport.activities &&
                      editingReport.activities.length > 0 && (
                        <div className="mt-6">
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">
                                Activity Logs
                              </CardTitle>
                              <CardDescription>
                                Track all changes made to this report
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {editingReport.activities.map(
                                  (activity, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div className="shrink-0">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm text-gray-900">
                                          <span className="font-medium">
                                            {activity.modifiedBy?.fullName ||
                                              "Unknown User"}
                                          </span>{" "}
                                          changed{" "}
                                          <span className="font-medium capitalize">
                                            {activity.category}
                                          </span>{" "}
                                          from{" "}
                                          <span className="font-medium text-red-600">
                                            {activity.oldValue || "N/A"}
                                          </span>{" "}
                                          to{" "}
                                          <span className="font-medium text-green-600">
                                            {activity.newValue}
                                          </span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                          {new Date(
                                            activity.modifiedAt,
                                          ).toLocaleDateString()}{" "}
                                          at{" "}
                                          {new Date(
                                            activity.modifiedAt,
                                          ).toLocaleTimeString()}
                                        </p>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}
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
