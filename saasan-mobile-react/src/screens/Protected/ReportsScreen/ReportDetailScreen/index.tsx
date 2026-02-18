import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  EyeOff,
  FileText,
  Camera,
  Upload,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Edit,
  X,
  Save,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useReports } from "@/hooks/useReports";
import type { CorruptionReport } from "@/types";
import Loading from "@/components/Loading";
import EvidencePicker from "@/components/EvidencePicker";
import toast from "react-hot-toast";

export default function ReportDetailScreen() {
  const { reportId } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const {
    getReport,
    voteOnReport,
    uploadEvidence,
    updateReport,
    deleteEvidence,
  } = useReports();
  const [report, setReport] = useState<CorruptionReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [evidenceToDelete, setEvidenceToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    try {
      const data = await getReport(reportId as string);
      setReport(data);
      setEditForm({
        title: data.title,
        description: data.description,
      });
    } catch (error) {
      toast.error("Failed to load report details");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      title: report?.title || "",
      description: report?.description || "",
    });
    setSelectedFiles([]);
  };

  console.log(isEditing);

  const handleSaveEdit = async () => {
    try {
      // Update report metadata
      await updateReport(reportId as string, editForm);

      // Upload new evidence if any
      if (selectedFiles.length > 0) {
        await uploadEvidence(reportId as string, selectedFiles);
      }

      toast.success("Report updated successfully");
      setIsEditing(false);
      setSelectedFiles([]);
      loadReport();
    } catch (error) {
      toast.error("Failed to update report");
    }
  };

  const handleDeleteEvidence = (evidenceId: string) => {
    setEvidenceToDelete(evidenceId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteEvidence = async () => {
    if (!evidenceToDelete || !report) return;

    try {
      // Find the evidence to get its cloudinaryPublicId
      const evidence = report.evidence?.find((e) => e.id === evidenceToDelete);
      if (!evidence) {
        toast.error("Evidence not found");
        return;
      }

      await deleteEvidence(
        reportId as string,
        evidenceToDelete,
        evidence.cloudinaryPublicId,
      );
      toast.success("Evidence deleted successfully");
      setShowDeleteConfirm(false);
      setEvidenceToDelete(null);
      loadReport();
    } catch (error) {
      toast.error("Failed to delete evidence");
    }
  };

  const handleVote = async (isUpvote: boolean) => {
    try {
      await voteOnReport(reportId as string, isUpvote);
      loadReport(); // Reload report to get updated vote counts
    } catch (error) {
      toast.error("Failed to register vote");
    }
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: report?.title || "Corruption Report",
          text: `Check out this corruption report: ${report?.description}`,
          url: `https://saasan.app/report/${reportId}`,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(
          `https://citizen.saasannepal.com/reports/${reportId}`,
        );
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      toast.error("Failed to share report");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-gray-500";
      case "under_review":
        return "bg-yellow-500";
      case "verified":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading || !report) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
      />
      <input
        ref={documentInputRef}
        type="file"
        accept="application/pdf,.doc,.docx"
        multiple
        className="hidden"
      />
      <input
        ref={audioInputRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
      />

      {/* Header */}
      <div className="bg-white m-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="flex items-center"
          >
            <ArrowLeft className="text-gray-600" size={24} />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {report?.title}
            </h1>
          </div>

          {!isEditing && (
            <Button
              onClick={handleEdit}
              variant="ghost"
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <Edit size={20} />
              <span className="ml-2">Edit</span>
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              className="w-full text-2xl font-bold text-gray-800 border-b-2 border-blue-500 focus:outline-none pb-1"
              placeholder="Report title"
            />
            <textarea
              value={editForm.description}
              onChange={(e) =>
                setEditForm({ ...editForm, description: e.target.value })
              }
              className="w-full text-gray-800 border-b-2 border-blue-500 focus:outline-none pb-1 min-h-[100px] resize-none"
              placeholder="Report description"
            />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800">{report.title}</h1>
            <p className="text-gray-700 mt-1">{report.description}</p>
          </>
        )}

        <div className="flex items-center justify-between mt-2">
          <div
            className={`px-3 py-1 rounded-full ${getStatusColor(
              report.status,
            )}`}
          >
            <span className="text-white text-xs font-bold uppercase">
              {report.status.replace("_", " ")}
            </span>
          </div>

          {isEditing && (
            <div className="flex space-x-2">
              <Button
                onClick={handleCancelEdit}
                variant="outline"
                className="flex items-center"
              >
                <X size={16} />
                <span className="ml-1">Cancel</span>
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="flex items-center bg-blue-600 hover:bg-blue-700"
              >
                <Save size={16} />
                <span className="ml-1">Save</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 px-3 py-3 overflow-y-auto">
        {/* Report Metadata */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800">
                Report Details
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="text-gray-500" size={14} />
                <span className="text-gray-500 text-sm ml-2">
                  {new Date(report.createdAt).toLocaleDateString()}
                </span>
              </div>
              {report.isAnonymous && (
                <div className="flex items-center">
                  <EyeOff className="text-gray-500" size={14} />
                  <span className="text-gray-500 text-sm ml-2">
                    Anonymous Report
                  </span>
                </div>
              )}
              <div className="flex items-center">
                <span className="text-gray-500 text-sm">
                  Reference: {report.referenceNumber}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Evidence Section */}
        <div className="mb-6">
          <p className="font-bold text-gray-800 mb-2">Evidence (Optional)</p>
          {isEditing && (
            <div className="flex flex-wrap gap-2 mb-4">
              <EvidencePicker
                onFileSelect={(files) => {
                  setSelectedFiles([...selectedFiles, ...files]);
                }}
                background="blue"
                text="Photo"
                Icon={Camera}
                accept="image/*"
                multiple={true}
              />
              <EvidencePicker
                onFileSelect={(files) => {
                  setSelectedFiles([...selectedFiles, ...files]);
                }}
                background="green"
                text="Document"
                Icon={FileText}
                accept="application/pdf,.doc,.docx"
                multiple={true}
              />
              <EvidencePicker
                onFileSelect={(files) => {
                  setSelectedFiles([...selectedFiles, ...files]);
                }}
                background="purple"
                text="Audio"
                Icon={Upload}
                accept="audio/*"
                multiple={true}
              />
            </div>
          )}
        </div>
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Selected Files:</p>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="relative flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                >
                  <div className="flex items-center space-x-2">
                    <FileText className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-700 truncate max-w-xs">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    onClick={() => {
                      setSelectedFiles(
                        selectedFiles.filter((_, i) => i !== index),
                      );
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 mt-3">
              <Button
                onClick={() => {
                  setSelectedFiles([]);
                }}
                variant="outline"
                className="flex-1"
              >
                Discard Changes
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {report.evidence && report.evidence.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {report.evidence.map((item, index: number) => (
              <div key={index} className="relative group">
                <div
                  className="w-full h-32 bg-white rounded-lg overflow-hidden border border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={() => {
                    if (item.filePath) {
                      window.open(item.filePath, "_blank");
                    }
                  }}
                >
                  {item.fileType === "image" ? (
                    <img
                      src={item.filePath}
                      alt={item.originalName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback for broken images
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement!.innerHTML = `
                            <div class="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                              <svg class="text-gray-400 mb-2" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.707.293H19a2 2 0 012 2v1a2 2 0 01-2 2h-1"></path>
                              </svg>
                              <span class="text-xs text-gray-500 text-center px-2">Image not available</span>
                            </div>
                          `;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                      <FileText className="text-gray-500 mb-2" size={24} />
                      <span className="text-xs text-gray-600 text-center px-2">
                        {item.originalName}
                      </span>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <button
                    onClick={() => handleDeleteEvidence(item.id.toString())}
                    className="absolute top-2 right-2 bg-gray-100 text-red-500 hover:text-red-700 hover:bg-gray-200 p-1 rounded-full shadow-md transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}

                <div className="mt-1">
                  <p className="text-xs text-gray-600 truncate">
                    {item.originalName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="text-gray-300 mx-auto mb-3" size={48} />
            <p className="text-gray-500">
              {isEditing
                ? "Add evidence using the buttons above"
                : "No evidence uploaded yet"}
            </p>
          </div>
        )}
        <p className="text-gray-500 text-xs mt-2">
          All evidence is encrypted and stored securely
        </p>
        {/* Actions */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg mb-4">
          <Button
            onClick={() => handleVote(true)}
            variant="ghost"
            className="flex items-center"
          >
            <ThumbsUp
              className={
                report.userVote === "up" ? "text-green-600" : "text-gray-500"
              }
              size={20}
            />
            <span className="ml-2 text-gray-800">{report.upvotesCount}</span>
          </Button>
          <Button
            onClick={() => handleVote(false)}
            variant="ghost"
            className="flex items-center"
          >
            <ThumbsDown
              className={
                report.userVote === "down" ? "text-red-600" : "text-gray-500"
              }
              size={20}
            />
            <span className="ml-2 text-gray-800">{report.downvotesCount}</span>
          </Button>
          <Button
            onClick={handleShare}
            variant="ghost"
            className="flex items-center"
          >
            <Share2 className="text-gray-500" size={20} />
            <span className="ml-2 text-gray-800">
              {report.sharesCount || 0}
            </span>
          </Button>
        </div>

        {/* Status Updates */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">
            Status Updates
          </h2>
          {report.statusUpdates && report.statusUpdates.length > 0 ? (
            report.statusUpdates.map((update, index: number) => (
              <Card key={index} className="mb-3">
                <CardContent className="p-4">
                  <h3 className="font-bold text-gray-800">{update.status}</h3>
                  <p className="text-gray-600 mt-1">{update.comment}</p>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(update.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-500 text-center">No status updates yet</p>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Delete Evidence
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this evidence? This action cannot
              be undone.
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => setShowDeleteConfirm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteEvidence}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
