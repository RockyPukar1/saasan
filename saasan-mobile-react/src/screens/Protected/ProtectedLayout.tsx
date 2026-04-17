import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import Tabs from "../../components/Tabs";
import { AccessDeniedState } from "@/components/AccessDeniedState";

export default function ProtectedLayout() {
  const { isAuthenticated, loading, canAccessCitizenApp } = useAuthContext();
  
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
    <>
      <div className="pb-20">
        <Outlet />
      </div>
      <Tabs />
    </>
  );
};
