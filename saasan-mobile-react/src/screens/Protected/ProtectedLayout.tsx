import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import Tabs from "../../components/Tabs";
import { AccessDeniedState } from "@/components/AccessDeniedState";

export default function ProtectedLayout() {
  const { isAuthenticated, loading, canAccessCitizenApp } = useAuthContext();
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("citizen-portal-sidebar-collapsed") === "true";
  });

  useEffect(() => {
    window.localStorage.setItem(
      "citizen-portal-sidebar-collapsed",
      String(isDesktopSidebarCollapsed),
    );
  }, [isDesktopSidebarCollapsed]);

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

  if (!canAccessCitizenApp) {
    return (
      <AccessDeniedState
        title="Access Denied"
        message="You do not have access to the citizen portal."
      />
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f6f8fc]"
      style={
        {
          "--desktop-sidebar-width": isDesktopSidebarCollapsed ? "5.5rem" : "18rem",
        } as CSSProperties
      }
    >
      <Tabs
        isDesktopSidebarCollapsed={isDesktopSidebarCollapsed}
        onDesktopSidebarToggle={() =>
          setIsDesktopSidebarCollapsed((current) => !current)
        }
      />
      <div className="min-h-screen lg:pl-[var(--desktop-sidebar-width)]">
        <div className="min-h-screen lg:min-w-0 lg:overflow-x-hidden">
          <div className="pb-20 lg:min-h-screen lg:pb-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
