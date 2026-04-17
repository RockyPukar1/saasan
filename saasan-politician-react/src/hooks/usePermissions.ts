import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function usePermissions() {
  const {
    user,
    permissions,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessPoliticianApp,
  } = useAuth();

  return useMemo(
    () => ({
      user,
      permissions,
      hasRole,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      canAccessPoliticianApp,
    }),
    [
      user,
      permissions,
      hasRole,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      canAccessPoliticianApp,
    ],
  );
}
