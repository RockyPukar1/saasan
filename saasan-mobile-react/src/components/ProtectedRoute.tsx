import React from "react";
import { AccessDeniedState } from "@/components/AccessDeniedState";
import { useAuthContext } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAllPermissions?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  requiredPermissions = [],
  requireAllPermissions = true,
}) => {
  const {
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  } = useAuthContext();

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <AccessDeniedState
        title="Access Denied"
        message="Your role does not allow access to this page."
      />
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <AccessDeniedState />;
  }

  if (requiredPermissions.length > 0) {
    const isAllowed = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!isAllowed) {
      return <AccessDeniedState />;
    }
  }

  return <>{children}</>;
};
