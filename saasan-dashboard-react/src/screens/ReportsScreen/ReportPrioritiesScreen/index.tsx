import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Search, Plus, Edit, Trash2, AlertTriangle, X } from "lucide-react";
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
import { reportPrioritiesApi } from "@/services/api";
import type { IReportPriority } from "@/types/reports";

export default function ReportPrioritiesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPriority, setEditingPriority] =
    useState<IReportPriority | null>(null);
  const [formData, setFormData] = useState({
    priority: "",
    description: "",
  });

  const queryClient = useQueryClient();

  // Fetch report priorities
  const { data: prioritiesData, isLoading } = useQuery({
    queryKey: ["report-priorities", searchQuery],
    queryFn: () => reportPrioritiesApi.getAll(),
  });

  // Create report priority mutation
  const createMutation = useMutation({
    mutationFn: (data: { priority: string; description: string }) =>
      reportPrioritiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-priorities"] });
      toast.success("Report priority created successfully!");
      setShowCreateForm(false);
      setFormData({ priority: "", description: "" });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create report priority",
      );
    },
  });

  // Update report priority mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { priority: string; description: string };
    }) => reportPrioritiesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-priorities"] });
      toast.success("Report priority updated successfully!");
      setEditingPriority(null);
      setFormData({ priority: "", description: "" });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update report priority",
      );
    },
  });

  // Delete report priority mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportPrioritiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-priorities"] });
      toast.success("Report priority deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete report priority",
      );
    },
  });

  const handleCreate = () => {
    if (!formData.priority.trim() || !formData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = (priority: IReportPriority) => {
    setEditingPriority(priority);
    setFormData({
      priority: priority.title,
      description: priority.description,
    });
    setShowCreateForm(true);
  };

  const handleUpdate = () => {
    if (
      !editingPriority ||
      !formData.priority.trim() ||
      !formData.description.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    updateMutation.mutate({
      id: editingPriority.id,
      data: formData,
    });
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this report priority?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const filteredPriorities =
    prioritiesData?.filter(
      (priority: IReportPriority) =>
        priority.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        priority.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const priorities = filteredPriorities || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Report Priorities
          </h1>
          <p className="text-gray-600">Manage report priority levels</p>
        </div>
        <Button
          onClick={() => {
            setEditingPriority(null);
            setFormData({ priority: "", description: "" });
            setShowCreateForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Report Priority
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search report priorities..."
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
              {editingPriority
                ? "Edit Report Priority"
                : "Create Report Priority"}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  placeholder="e.g., urgent"
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
                  placeholder="e.g., Requires immediate attention"
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
                onClick={editingPriority ? handleUpdate : handleCreate}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingPriority ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Priorities List */}
      <Card>
        <CardHeader>
          <CardTitle>Report Priorities ({priorities.length})</CardTitle>
          <CardDescription>Manage report priority levels</CardDescription>
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
          ) : priorities.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No report priorities found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {priorities.map((priority) => (
                <div
                  key={priority.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {priority.title}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full">
                          {priority.title}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {priority.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        Created:{" "}
                        {new Date(priority.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(priority)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(priority.id)}
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
