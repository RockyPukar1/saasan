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
import { PoliticiansPage } from "@/screens/PoliticiansPage";
import { HistoricalEventsPage } from "@/screens/HistoricalEventsPage";
import PollingPage from "@/screens/PollingPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import "./index.css";
import ReportsScreen from "./screens/ReportsScreen";
import ReportTypesScreen from "./screens/ReportsScreen/ReportTypeScreen";
import ReportStatusesScreen from "./screens/ReportsScreen/ReportStatusScreen";
import ReportPrioritiesScreen from "./screens/ReportPrioritiesScreen/ReportPrioritiesScreen";
import ReportVisibilitiesScreen from "./screens/ReportsScreen/ReportVisibilityScreen";

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
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="politicians" element={<PoliticiansPage />} />
                <Route path="reports" element={<ReportsScreen />} />
                <Route path="reports/types" element={<ReportTypesScreen />} />
                <Route
                  path="reports/statuses"
                  element={<ReportStatusesScreen />}
                />
                <Route
                  path="reports/priorities"
                  element={<ReportPrioritiesScreen />}
                />
                <Route
                  path="reports/visibilities"
                  element={<ReportVisibilitiesScreen />}
                />
                <Route
                  path="historical-events"
                  element={<HistoricalEventsPage />}
                />
                {/* <Route path="major-cases" element={<MajorCasesPage />} />
                <Route path="geographic" element={<GeographicPage />} /> */}
                <Route path="polling" element={<PollingPage />} />
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
