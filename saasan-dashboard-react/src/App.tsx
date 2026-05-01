import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginPage } from "@/screens/LoginPage";
import { DashboardPage } from "@/screens/DashboardPage";
import { HistoricalEventsPage } from "@/screens/HistoricalEventsPage";
import PollingPage from "@/screens/PollingPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import "./index.css";
import ReportsScreen from "./screens/ReportsScreen";
import ReportTypesScreen from "./screens/ReportsScreen/ReportTypeScreen";
import ReportStatusesScreen from "./screens/ReportsScreen/ReportStatusScreen";
import ReportPrioritiesScreen from "./screens/ReportsScreen/ReportPrioritiesScreen";
import ReportVisibilitiesScreen from "./screens/ReportsScreen/ReportVisibilityScreen";
import GeographyScreen from "./screens/GeographyScreen";
import ProvinceScreen from "./screens/GeographyScreen/ProvinceScreen";
import DistrictScreen from "./screens/GeographyScreen/DistrictScreen";
import MunicipalityScreen from "./screens/GeographyScreen/MunicipalityScreen";
import PoliticiansScreen from "./screens/PoliticiansScreen";
import PartyScreen from "./screens/PartyScreen";
import UsersScreen from "./screens/UsersScreen";
import { PERMISSIONS } from "./constants/permission.constants";
import SessionsPage from "./screens/SessionsScreen";
import RolePermissionsPage from "./screens/RolePermissionsScreen";
import JobsScreen from "./screens/JobsScreen";
import BudgetScreen from "./screens/BudgetScreen";
import { MajorCasesPage } from "./screens/MajorCasesPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  path="sessions"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.sessions.view}
                    >
                      <SessionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="jobs"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.jobs.view}>
                      <JobsScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="budget"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.budget.view}>
                      <BudgetScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="role-permissions"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.roles.view}>
                      <RolePermissionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.dashboard.view}
                    >
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="politicians"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.politicians.view}
                    >
                      <PoliticiansScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="parties"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.parties.view}
                    >
                      <PartyScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="users"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.users.view}>
                      <UsersScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.reports.view}
                    >
                      <ReportsScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reports/types"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.reports.types.view}
                    >
                      <ReportTypesScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reports/statuses"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.reports.statuses.view}
                    >
                      <ReportStatusesScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reports/priorities"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.reports.priorities.view}
                    >
                      <ReportPrioritiesScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="reports/visibilities"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.reports.visibilities.view}
                    >
                      <ReportVisibilitiesScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="historical-events"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.dashboard.view}
                    >
                      <HistoricalEventsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="major-cases"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.cases.view}
                    >
                      <MajorCasesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="geography"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.geography.view}
                    >
                      <GeographyScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="geography/province/:provinceId"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.geography.view}
                    >
                      <ProvinceScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="geography/district/:districtId"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.geography.view}
                    >
                      <DistrictScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="geography/municipality/:municipalityId"
                  element={
                    <ProtectedRoute
                      requiredPermission={PERMISSIONS.geography.view}
                    >
                      <MunicipalityScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="polling"
                  element={
                    <ProtectedRoute requiredPermission={PERMISSIONS.polls.view}>
                      <PollingPage />
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                  path="viral-management"
                  element={<ViralManagementPage />}
                /> */}
              </Route>
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  border: "1px solid hsl(var(--border))",
                },
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
