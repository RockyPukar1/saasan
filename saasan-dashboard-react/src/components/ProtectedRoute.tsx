import React from "react";
import { Navigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/contexts/AuthContext";
import { AccessDeniedState } from "@/components/AccessDeniedState";

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
  const { isAuthenticated, loading } = useAuth();
  const {
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessAdminApp,
  } = usePermissions();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!canAccessAdminApp) {
    return (
      <AccessDeniedState
        title="Access Denied"
        message="You do not have access to the admin dashboard."
      />
    );
  }

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
