import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Plus,
  Search,
  Upload,
  Edit,
  Trash2,
  Filter,
  Download,
  X,
  Shield,
  User,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
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
import { userApi } from "@/services/api";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import type { IUser } from "@/types/user";
import UserEditForm from "@/components/user/UserEditForm";

const initialFilter = {
  search: "",
};

export default function UsersScreen() {
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const [searchQuery, setSearchQuery] = useState("");
  const [toApplyFilter, setToApplyFilter] = useState(initialFilter);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const queryClient = useQueryClient();

  const { data: usersData, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => userApi.getAll(),
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await userApi.delete(id);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User deleted successfully!");
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to delete user";
      toast.error(errorMessage);
    },
  });

  // Bulk upload mutation (placeholder)
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      // Note: You'll need to add this endpoint to the backend
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/users/bulk-upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Failed to upload file");
      return response.json();
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`Successfully imported ${response.imported} users`);
      setShowUploadModal(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to upload file");
    },
  });

  const handleEdit = async (user: IUser) => {
    try {
      setEditingUser(user);
      setShowForm(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    }
  };

  const handleDelete = (id: string) => {
    confirm({
      title: "Delete User",
      description:
        "Are you sure you want to delete this user? This action cannot be undone.",
      variant: "destructive",
      confirmText: "Delete",
      onConfirm: () => deleteMutation.mutate(id),
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadMutation.mutate(file);
    }
  };

  const users = usersData?.data || [];
  const usersTotal = usersData?.total || 0;

  const filteredUsers = users.filter((user: IUser) => {
    const searchLower = toApplyFilter.search.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    );
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "politician":
        return "bg-blue-100 text-blue-800";
      case "citizen":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowUploadModal(true)}
            disabled={uploadMutation.isPending}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload CSV
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex items-end">
                <Button
                  onClick={() => setToApplyFilter({ search: searchQuery })}
                  variant="outline"
                  className="w-full"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setToApplyFilter(initialFilter);
                  }}
                  variant="outline"
                  disabled={!toApplyFilter.search}
                  className="w-full text-white bg-red-600 rounded-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users ({usersTotal})</CardTitle>
              <CardDescription>
                Manage user accounts and their permissions
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
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {user.fullName}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                              user.role,
                            )}`}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </span>
                          <div className="flex items-center space-x-2">
                            {user.isActive ? (
                              <span className="flex items-center text-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </span>
                            ) : (
                              <span className="flex items-center text-red-600">
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactive
                              </span>
                            )}
                            {user.isVerified && (
                              <span className="flex items-center text-blue-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </span>
                            )}
                          </div>
                        </div>
                        {(user.provinceId ||
                          user.districtId ||
                          user.municipalityId) && (
                          <div className="flex items-center space-x-2 mt-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-400">
                              {user.provinceId && "Province"}
                              {user.provinceId && user.districtId && ", "}
                              {user.districtId && "District"}
                              {user.districtId && user.municipalityId && ", "}
                              {user.municipalityId && "Municipality"}
                            </p>
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Last active:{" "}
                          {user.lastActiveAt
                            ? new Date(user.lastActiveAt).toLocaleDateString()
                            : "Never"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      {showForm && editingUser && (
        <UserEditForm
          setShowForm={setShowForm}
          editingUser={editingUser}
          setEditingUser={setEditingUser}
        />
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
                <CardTitle>Upload Users CSV</CardTitle>
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
                Upload a CSV file with user data. Make sure the file has the
                correct format.
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
                    onChange={handleFileUpload}
                    disabled={uploadMutation.isPending}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  <p>CSV should include columns:</p>
                  <ul className="list-disc list-inside mt-1">
                    <li>email</li>
                    <li>fullName</li>
                    <li>role</li>
                    <li>isActive</li>
                    <li>isVerified</li>
                    <li>provinceId (optional)</li>
                    <li>districtId (optional)</li>
                    <li>municipalityId (optional)</li>
                  </ul>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                    disabled={uploadMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <ConfirmDialog />
    </div>
  );
}
