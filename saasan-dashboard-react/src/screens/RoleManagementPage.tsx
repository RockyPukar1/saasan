import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  skipToken,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  Settings,
  Users,
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { rbacApi } from "@/services/api";
import type {
  IRole,
  IPermission,
  ICreatePermissionData,
  ICreateRoleData,
} from "@/types/rbac";

export default function RoleManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [editingRole, setEditingRole] = useState<IRole | null>(null);
  const [editingPermission, setEditingPermission] =
    useState<IPermission | null>(null);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [roleFormData, setRoleFormData] = useState<ICreateRoleData>({
    name: "",
    description: "",
    adminRole: "",
  });
  const [permissionFormData, setPermissionFormData] =
    useState<ICreatePermissionData>({
      name: "",
      description: "",
      resource: "",
      action: "",
      module: "",
    });

  const queryClient = useQueryClient();

  // Fetch roles and permissions
  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => rbacApi.getRoles(),
  });

  const { data: permissionsData, isLoading: permissionsLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => rbacApi.getPermissions(),
  });

  const { data: rolePermissionsData } = useQuery({
    queryKey: ["role-permissions", selectedRole?.id],
    queryFn: selectedRole
      ? () => rbacApi.getRolePermissions(selectedRole.id)
      : skipToken,
    enabled: !!selectedRole,
  });

  // Role mutations
  const createRoleMutation = useMutation({
    mutationFn: (data: ICreateRoleData) => rbacApi.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role created successfully!");
      setShowRoleForm(false);
      setRoleFormData({ name: "", description: "", adminRole: "" });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create role");
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ICreateRoleData }) =>
      rbacApi.updateRole(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role updated successfully!");
      setEditingRole(null);
      setRoleFormData({ name: "", description: "", adminRole: "" });
      setShowRoleForm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update role");
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) => rbacApi.deleteRole(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully!");
      if (selectedRole?.id === id) {
        setSelectedRole(null);
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete role");
    },
  });

  // Permission mutations
  const createPermissionMutation = useMutation({
    mutationFn: (data: ICreatePermissionData) => rbacApi.createPermission(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission created successfully!");
      setShowPermissionForm(false);
      setPermissionFormData({
        name: "",
        description: "",
        resource: "",
        action: "",
        module: "",
      });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to create permission",
      );
    },
  });

  const updatePermissionMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ICreatePermissionData }) =>
      rbacApi.updatePermission(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission updated successfully!");
      setEditingPermission(null);
      setPermissionFormData({
        name: "",
        description: "",
        resource: "",
        action: "",
        module: "",
      });
      setShowPermissionForm(false);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update permission",
      );
    },
  });

  const deletePermissionMutation = useMutation({
    mutationFn: (id: string) => rbacApi.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast.success("Permission deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to delete permission",
      );
    },
  });

  // Permission assignment mutations
  const assignPermissionMutation = useMutation({
    mutationFn: ({
      roleId,
      permissionId,
    }: {
      roleId: string;
      permissionId: string;
    }) => rbacApi.assignPermission(roleId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["role-permissions", selectedRole?.id],
      });
      toast.success("Permission assigned successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to assign permission",
      );
    },
  });

  const removePermissionMutation = useMutation({
    mutationFn: ({
      roleId,
      permissionId,
    }: {
      roleId: string;
      permissionId: string;
    }) => rbacApi.removePermission(roleId, permissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["role-permissions", selectedRole?.id],
      });
      toast.success("Permission removed successfully!");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to remove permission",
      );
    },
  });

  // Handlers
  const handleCreateRole = () => {
    if (!roleFormData.name.trim() || !roleFormData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    createRoleMutation.mutate(roleFormData);
  };

  const handleEditRole = (role: IRole) => {
    setEditingRole(role);
    setRoleFormData({
      name: role.name,
      description: role.description,
      adminRole: role.adminRole || "",
    });
    setShowRoleForm(true);
  };

  const handleUpdateRole = () => {
    if (
      !editingRole ||
      !roleFormData.name.trim() ||
      !roleFormData.description.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    updateRoleMutation.mutate({
      id: editingRole.id,
      data: roleFormData,
    });
  };

  const handleDeleteRole = (id: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      deleteRoleMutation.mutate(id);
    }
  };

  const handleCreatePermission = () => {
    if (
      !permissionFormData.name.trim() ||
      !permissionFormData.description.trim() ||
      !permissionFormData.resource.trim() ||
      !permissionFormData.action.trim() ||
      !permissionFormData.module.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    createPermissionMutation.mutate(permissionFormData);
  };

  const handleEditPermission = (permission: IPermission) => {
    setEditingPermission(permission);
    setPermissionFormData({
      name: permission.name,
      description: permission.description,
      resource: permission.resource,
      action: permission.action,
      module: permission.module,
    });
    setShowPermissionForm(true);
  };

  const handleUpdatePermission = () => {
    if (
      !editingPermission ||
      !permissionFormData.name.trim() ||
      !permissionFormData.description.trim() ||
      !permissionFormData.resource.trim() ||
      !permissionFormData.action.trim() ||
      !permissionFormData.module.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    updatePermissionMutation.mutate({
      id: editingPermission.id,
      data: permissionFormData,
    });
  };

  const handleDeletePermission = (id: string) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      deletePermissionMutation.mutate(id);
    }
  };

  const handleTogglePermission = (permissionId: string, isChecked: boolean) => {
    if (!selectedRole) return;

    if (isChecked) {
      assignPermissionMutation.mutate({
        roleId: selectedRole.id,
        permissionId,
      });
    } else {
      removePermissionMutation.mutate({
        roleId: selectedRole.id,
        permissionId,
      });
    }
  };

  const filteredRoles =
    rolesData?.filter(
      (role: IRole) =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const filteredPermissions =
    permissionsData?.filter(
      (permission: IPermission) =>
        permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        permission.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.module.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const roles = filteredRoles || [];
  const permissions = filteredPermissions || [];
  const rolePermissions = rolePermissionsData || [];

  const getAdminRoleBadgeColor = (adminRole?: string) => {
    switch (adminRole) {
      case "super_admin":
        return "bg-red-100 text-red-800";
      case "moderator":
        return "bg-blue-100 text-blue-800";
      case "data_steward":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAdminRoleDisplayName = (adminRole?: string) => {
    switch (adminRole) {
      case "super_admin":
        return "Super Admin";
      case "moderator":
        return "Moderator";
      case "data_steward":
        return "Data Steward";
      default:
        return "Custom";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Role & Permission Management
          </h1>
          <p className="text-gray-600">Manage user roles and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setEditingRole(null);
              setRoleFormData({ name: "", description: "", adminRole: "" });
              setShowRoleForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Role
          </Button>
          <Button
            onClick={() => {
              setEditingPermission(null);
              setPermissionFormData({
                name: "",
                description: "",
                resource: "",
                action: "",
                module: "",
              });
              setShowPermissionForm(true);
            }}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Permission
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search roles and permissions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Roles ({roles.length})
              </CardTitle>
              <CardDescription>Manage system roles</CardDescription>
            </CardHeader>
            <CardContent>
              {rolesLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : roles.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No roles found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedRole?.id === role.id
                          ? "border-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedRole(role)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {role.name}
                            </h3>
                            {role.adminRole && (
                              <Badge
                                className={getAdminRoleBadgeColor(
                                  role.adminRole,
                                )}
                              >
                                {getAdminRoleDisplayName(role.adminRole)}
                              </Badge>
                            )}
                            {!role.isActive && (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {role.description}
                          </p>
                          <div className="text-xs text-gray-500">
                            Created:{" "}
                            {new Date(role.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditRole(role);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRole(role.id);
                            }}
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

          {/* Role Permissions */}
          {selectedRole && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {selectedRole.name} Permissions
                </CardTitle>
                <CardDescription>
                  Manage permissions for {selectedRole.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {permissionsLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    permissions.map((permission) => {
                      const isAssigned = rolePermissions.some(
                        (p) => p.id === permission.id,
                      );
                      return (
                        <div
                          key={permission.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={isAssigned}
                                onCheckedChange={(checked) =>
                                  handleTogglePermission(
                                    permission.id,
                                    Boolean(checked),
                                  )
                                }
                              />
                              <div>
                                <div className="font-medium">
                                  {permission.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {permission.resource}:{permission.action}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">
                              {permission.module}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPermission(permission)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Permissions Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissions ({permissions.length})
              </CardTitle>
              <CardDescription>Manage system permissions</CardDescription>
            </CardHeader>
            <CardContent>
              {permissionsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : permissions.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No permissions found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {permission.name}
                            </h3>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {permission.resource}:{permission.action}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {permission.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Module: {permission.module}</span>
                            <span>
                              Created:{" "}
                              {new Date(
                                permission.createdAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPermission(permission)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeletePermission(permission.id)
                            }
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
      </div>

      {/* Role Form Modal */}
      {showRoleForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowRoleForm(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingRole ? "Edit Role" : "Create Role"}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={roleFormData.name}
                  onChange={(e) =>
                    setRoleFormData({ ...roleFormData, name: e.target.value })
                  }
                  placeholder="e.g., Moderator"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={roleFormData.description}
                  onChange={(e) =>
                    setRoleFormData({
                      ...roleFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="e.g., Handles content moderation"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="adminRole">Admin Role Type</Label>
                <select
                  id="adminRole"
                  value={roleFormData.adminRole}
                  onChange={(e) =>
                    setRoleFormData({
                      ...roleFormData,
                      adminRole: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded-md"
                >
                  <option value="">Select admin role type (optional)</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="data_steward">Data Steward</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowRoleForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={editingRole ? handleUpdateRole : handleCreateRole}
                disabled={
                  createRoleMutation.isPending || updateRoleMutation.isPending
                }
              >
                {editingRole ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Permission Form Modal */}
      {showPermissionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowPermissionForm(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <h2 className="text-xl font-bold mb-4">
              {editingPermission ? "Edit Permission" : "Create Permission"}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Permission Name</Label>
                <Input
                  id="name"
                  value={permissionFormData.name}
                  onChange={(e) =>
                    setPermissionFormData({
                      ...permissionFormData,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Create Users"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={permissionFormData.description}
                  onChange={(e) =>
                    setPermissionFormData({
                      ...permissionFormData,
                      description: e.target.value,
                    })
                  }
                  placeholder="e.g., Allows creating new users"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="resource">Resource</Label>
                  <Input
                    id="resource"
                    value={permissionFormData.resource}
                    onChange={(e) =>
                      setPermissionFormData({
                        ...permissionFormData,
                        resource: e.target.value,
                      })
                    }
                    placeholder="e.g., users"
                  />
                </div>
                <div>
                  <Label htmlFor="action">Action</Label>
                  <select
                    id="action"
                    value={permissionFormData.action}
                    onChange={(e) =>
                      setPermissionFormData({
                        ...permissionFormData,
                        action: e.target.value,
                      })
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Select action</option>
                    <option value="create">Create</option>
                    <option value="read">Read</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                    <option value="manage">Manage</option>
                  </select>
                </div>
              </div>
              <div>
                <Label htmlFor="module">Module</Label>
                <Input
                  id="module"
                  value={permissionFormData.module}
                  onChange={(e) =>
                    setPermissionFormData({
                      ...permissionFormData,
                      module: e.target.value,
                    })
                  }
                  placeholder="e.g., user_management"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowPermissionForm(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={
                  editingPermission
                    ? handleUpdatePermission
                    : handleCreatePermission
                }
                disabled={
                  createPermissionMutation.isPending ||
                  updatePermissionMutation.isPending
                }
              >
                {editingPermission ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
