import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Search, Plus, Edit, Trash2, EyeOff, X } from "lucide-react";
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
import { reportVisibilitiesApi } from "@/services/api";
import type { IReportVisibility } from "@/types/reports";

const visibilityColors = {
  public: "bg-green-100 text-green-800",
  private: "bg-yellow-100 text-yellow-800",
  restricted: "bg-red-100 text-red-800",
};

// const visibilityIcons = {
//   public: <Eye className="h-4 w-4" />,
//   private: <EyeOff className="h-4 w-4" />,
//   restricted: <Globe className="h-4 w-4" />,
// };

export default function IReportVisibilityScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingVisibility, setEditingVisibility] =
    useState<IReportVisibility | null>(null);
  const [formData, setFormData] = useState({
    visibility: "",
    description: "",
  });

  const queryClient = useQueryClient();

  // Fetch report visibilities
  const { data: visibilitiesData, isLoading } = useQuery({
    queryKey: ["report-visibilities", searchQuery],
    queryFn: () => reportVisibilitiesApi.getAll(),
  });

  // Create report visibility mutation
  const createMutation = useMutation({
    mutationFn: (data: { visibility: string; description: string }) =>
      reportVisibilitiesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-visibilities"] });
      toast.success("Report visibility created successfully!");
      setShowCreateForm(false);
      setFormData({ visibility: "", description: "" });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create report visibility",
      );
    },
  });

  // Update report visibility mutation
  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { visibility: string; description: string };
    }) => reportVisibilitiesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-visibilities"] });
      toast.success("Report visibility updated successfully!");
      setEditingVisibility(null);
      setFormData({ visibility: "", description: "" });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update report visibility",
      );
    },
  });

  // Delete report visibility mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportVisibilitiesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-visibilities"] });
      toast.success("Report visibility deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete report visibility",
      );
    },
  });

  const handleCreate = () => {
    if (!formData.visibility.trim() || !formData.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    createMutation.mutate(formData);
  };

  const handleEdit = (visibility: IReportVisibility) => {
    setEditingVisibility(visibility);
    setFormData({
      visibility: visibility.title,
      description: visibility.description,
    });
    setShowCreateForm(true);
  };

  const handleUpdate = () => {
    if (
      !editingVisibility ||
      !formData.visibility.trim() ||
      !formData.description.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    updateMutation.mutate({
      id: editingVisibility.id,
      data: formData,
    });
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this report visibility?")
    ) {
      deleteMutation.mutate(id);
    }
  };

  const getVisibilityColor = (visibility: string) => {
    return (
      visibilityColors[visibility as keyof typeof visibilityColors] ||
      "bg-gray-100 text-gray-800"
    );
  };

  // const getVisibilityIcon = (visibility: string) => {
  //   return (
  //     visibilityIcons[visibility as keyof typeof visibilityIcons] || (
  //       <Eye className="h-4 w-4" />
  //     )
  //   );
  // };

  const filteredVisibilities =
    visibilitiesData?.filter(
      (visibility: IReportVisibility) =>
        visibility.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visibility.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
    ) || [];

  const visibilities = filteredVisibilities || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Report Visibilities
          </h1>
          <p className="text-gray-600">Manage report visibility settings</p>
        </div>
        <Button
          onClick={() => {
            setEditingVisibility(null);
            setFormData({ visibility: "", description: "" });
            setShowCreateForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Report Visibility
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search report visibilities..."
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
              {editingVisibility
                ? "Edit Report Visibility"
                : "Create Report Visibility"}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="visibility">Visibility</Label>
                <Input
                  id="visibility"
                  value={formData.visibility}
                  onChange={(e) =>
                    setFormData({ ...formData, visibility: e.target.value })
                  }
                  placeholder="e.g., public"
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
                  placeholder="e.g., Visible to everyone"
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
                onClick={editingVisibility ? handleUpdate : handleCreate}
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingVisibility ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Visibilities List */}
      <Card>
        <CardHeader>
          <CardTitle>Report Visibilities ({visibilities.length})</CardTitle>
          <CardDescription>Manage report visibility settings</CardDescription>
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
          ) : visibilities.length === 0 ? (
            <div className="text-center py-8">
              <EyeOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No report visibilities found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {visibilities.map((visibility) => (
                <div
                  key={visibility.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {visibility.title}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getVisibilityColor(visibility.title)}`}
                        >
                          {visibility.title}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {visibility.description}
                      </p>
                      <div className="text-xs text-gray-500">
                        Created:{" "}
                        {new Date(visibility.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(visibility)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(visibility.id)}
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
