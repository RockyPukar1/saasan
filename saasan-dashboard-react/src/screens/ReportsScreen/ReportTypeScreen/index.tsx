import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Search, Plus, Edit, Trash2, Flag, X } from "lucide-react";
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
import { reportTypesApi } from "@/services/api";

interface ReportType {
  _id: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReportTypeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingType, setEditingType] = useState<ReportType | null>(null);
  const [formData, setFormData] = useState({
    type: "",
    description: "",
  });

  const queryClient = useQueryClient();

  // Fetch report types
  const { data: typesData, isLoading } = useQuery({
    queryKey: ["report-types", searchQuery],
    queryFn: () => reportTypesApi.getAll(),
  });

  // Create report type mutation
  const createMutation = useMutation({
    mutationFn: (data: { type: string; description: string }) =>
      reportTypesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-types"] });
      toast.success("Report type created successfully!");
      setShowCreateForm(false);
      setFormData({ type: "", description: "" });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create report type",
      );
    },
  });

  // Update report type mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { type: string; description: string };
    }) => reportTypesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-types"] });
      toast.success("Report type updated successfully!");
      setEditingType(null);
      setFormData({ type: "", description: "" });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update report type",
      );
    },
  });

  // Delete report type mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportTypesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-types"] });
      toast.success("Report type deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete report type",
      );
    },
  });

  const handleCreate = () => {
    if (!formData.type.trim() || !formData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = (type: ReportType) => {
    setEditingType(type);
    setFormData({
      type: type.type,
      description: type.description,
    });
    setShowCreateForm(true);
  };

  const handleUpdate = () => {
    if (!editingType || !formData.type.trim() || !formData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    updateMutation.mutate({
      id: editingType._id,
      data: formData,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this report type?")) {
      deleteMutation.mutate(id);
    }
  };

  const filteredTypes =
    typesData?.data?.filter(
      (type: ReportType) =>
        type.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        type.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const types = filteredTypes || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Report Types</h1>
          <p className="text-gray-600">Manage report type categories</p>
        </div>
        <Button
          onClick={() => {
            setEditingType(null);
            setFormData({ type: "", description: "" });
            setShowCreateForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Report Type
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search report types..."
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
              {editingType ? "Edit Report Type" : "Create Report Type"}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Input
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  placeholder="e.g., complaint"
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
                  placeholder="e.g., General corruption complaint"
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
                onClick={editingType ? handleUpdate : handleCreate}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingType ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Types List */}
      <Card>
        <CardHeader>
          <CardTitle>Report Types ({types.length})</CardTitle>
          <CardDescription>Manage report type categories</CardDescription>
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
          ) : types.length === 0 ? (
            <div className="text-center py-8">
              <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No report types found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {types.map((type) => (
                <div
                  key={type._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {type.type}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {type.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {type.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(type.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(type)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(type._id)}
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
