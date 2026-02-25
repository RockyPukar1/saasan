import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { reportStatusesApi } from "@/services/api";

interface ReportStatus {
  _id: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors = {
  pending: "bg-gray-100 text-gray-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  under_review: "bg-yellow-100 text-yellow-800",
  verified: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  dismissed: "bg-red-100 text-red-800",
};

export default function ReportStatusScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingStatus, setEditingStatus] = useState<ReportStatus | null>(null);
  const [formData, setFormData] = useState({
    status: "",
    description: "",
  });

  const queryClient = useQueryClient();

  // Fetch report statuses
  const { data: statusesData, isLoading } = useQuery({
    queryKey: ["report-statuses", searchQuery],
    queryFn: () => reportStatusesApi.getAll(),
  });

  // Create report status mutation
  const createMutation = useMutation({
    mutationFn: (data: { status: string; description: string }) =>
      reportStatusesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-statuses"] });
      toast.success("Report status created successfully!");
      setShowCreateForm(false);
      setFormData({ status: "", description: "" });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create report status",
      );
    },
  });

  // Update report status mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { status: string; description: string };
    }) => reportStatusesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-statuses"] });
      toast.success("Report status updated successfully!");
      setEditingStatus(null);
      setFormData({ status: "", description: "" });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update report status",
      );
    },
  });

  // Delete report status mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportStatusesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-statuses"] });
      toast.success("Report status deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete report status",
      );
    },
  });

  const handleCreate = () => {
    if (!formData.status.trim() || !formData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = (status: ReportStatus) => {
    setEditingStatus(status);
    setFormData({
      status: status.status,
      description: status.description,
    });
    setShowCreateForm(true);
  };

  const handleUpdate = () => {
    if (
      !editingStatus ||
      !formData.status.trim() ||
      !formData.description.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    updateMutation.mutate({
      id: editingStatus._id,
      data: formData,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this report status?")) {
      deleteMutation.mutate(id);
    }
  };

  const getStatusColor = (status: string) => {
    return (
      statusColors[status as keyof typeof statusColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  const filteredStatuses =
    statusesData?.data?.filter(
      (status: ReportStatus) =>
        status.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
        status.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const statuses = filteredStatuses || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report Statuses</h1>
          <p className="text-gray-600">Manage report status options</p>
        </div>
        <Button
          onClick={() => {
            setEditingStatus(null);
            setFormData({ status: "", description: "" });
            setShowCreateForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Report Status
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search report statuses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setShowCreateForm(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingStatus ? "Edit Report Status" : "Create Report Status"}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  placeholder="e.g., pending"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="e.g., Report is pending review"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={editingStatus ? handleUpdate : handleCreate}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingStatus ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Statuses List */}
      <Card>
        <CardHeader>
          <CardTitle>Report Statuses ({statuses.length})</CardTitle>
          <CardDescription>Manage report status options</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : statuses.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No report statuses found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {statuses.map((status) => (
                <div
                  key={status._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {status.status}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status.status)}`}
                        >
                          {status.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {status.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        Created:{" "}
                        {new Date(status.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(status)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(status._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
