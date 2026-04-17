import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";

export function usePermissions() {
  const {
    user,
    permissions,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessAdminApp,
  } = useAuth();

  return useMemo(
    () => ({
      user,
      permissions,
      hasRole,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      canAccessAdminApp,
    }),
    [
      user,
      permissions,
      hasRole,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      canAccessAdminApp,
    ],
  );
}
