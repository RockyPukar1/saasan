import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Shield, Save, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { rolePermissionApi } from "@/services/api";
import { PERMISSIONS } from "@/constants/permission.constants";
import { useAuth } from "@/contexts/AuthContext";
import { PermissionGate } from "@/components/PermissionGate";
import type { UserRole } from "@/types/user";

const ROLE_OPTIONS: UserRole[] = ["admin", "citizen", "politician"];

const flattenPermissions = (obj: any): string[] => {
  const result: string[] = [];

  const walk = (value: any) => {
    Object.values(value).forEach((entry) => {
      if (typeof entry === "string") {
        result.push(entry);
      } else if (entry && typeof entry === "object") {
        walk(entry);
      }
    });
  };

  walk(obj);
  return result;
};

const ALL_PERMISSION_KEYS = flattenPermissions(PERMISSIONS);

export default function RolePermissionsPage() {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const canViewRoles = hasPermission(PERMISSIONS.roles.view);
  const canUpdateRolePermissions = hasPermission(
    PERMISSIONS.roles.updatePermissions,
  );

  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const {
    data: rolePermissionResponse,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["role-permissions", selectedRole],
    queryFn: () => rolePermissionApi.getByRole(selectedRole),
    enabled: canViewRoles,
  });

  useEffect(() => {
    if (rolePermissionResponse?.success) {
      setSelectedPermissions(rolePermissionResponse.data.permissions || []);
    }
  }, [rolePermissionResponse]);

  const groupedPermissions = useMemo(() => {
    return ALL_PERMISSION_KEYS.reduce<Record<string, string[]>>(
      (acc, permission) => {
        const group = permission.split(".")[0];
        if (!acc[group]) {
          acc[group] = [];
        }
        acc[group].push(permission);
        return acc;
      },
      {},
    );
  }, []);

  const updateMutation = useMutation({
    mutationFn: (payload: { role: string; permissions: string[] }) =>
      rolePermissionApi.update(payload.role, {
        permissions: payload.permissions,
      }),
    onSuccess: async () => {
      toast.success("Role permissions updated successfully");
      await queryClient.invalidateQueries({
        queryKey: ["role-permissions", selectedRole],
      });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update role permissions");
    },
  });

  const togglePermission = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((item) => item !== permission)
        : [...prev, permission],
    );
  };

  const handleSave = () => {
    if (!canUpdateRolePermissions) {
      toast.error("You do not have permission to update role permissions");
      return;
    }

    updateMutation.mutate({
      role: selectedRole,
      permissions: selectedPermissions,
    });
  };

  if (!canViewRoles) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              You do not have permission to view role permissions.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Role Permissions</h1>
          <p className="text-gray-600">
            Manage permissions for admin, citizen, and politician roles
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <PermissionGate permission={PERMISSIONS.roles.updatePermissions}>
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </PermissionGate>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Role</CardTitle>
          <CardDescription>
            Choose which role you want to configure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ROLE_OPTIONS.map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? "default" : "outline"}
                onClick={() => setSelectedRole(role)}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Permissions for{" "}
            {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
          </CardTitle>
          <CardDescription>
            Enable or disable permissions for this role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(
                ([group, permissions]) => (
                  <div key={group} className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold capitalize mb-4">
                      {group}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {permissions.map((permission) => {
                        const checked =
                          selectedPermissions.includes(permission);

                        return (
                          <label
                            key={permission}
                            className="flex items-center gap-3 rounded border p-3 cursor-pointer hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4"
                              checked={checked}
                              onChange={() => togglePermission(permission)}
                              disabled={!canUpdateRolePermissions}
                            />
                            <span className="text-sm text-gray-800">
                              {permission}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
