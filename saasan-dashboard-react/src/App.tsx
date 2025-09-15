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
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { PoliticiansPage } from "@/pages/PoliticiansPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { HistoricalEventsPage } from "@/pages/HistoricalEventsPage";
import { MajorCasesPage } from "@/pages/MajorCasesPage";
import { GeographicPage } from "@/pages/GeographicPage";
import PollingPage from "@/pages/PollingPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import "./index.css";

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
                <Route path="reports" element={<ReportsPage />} />
                <Route
                  path="historical-events"
                  element={<HistoricalEventsPage />}
                />
                <Route path="major-cases" element={<MajorCasesPage />} />
                <Route path="geographic" element={<GeographicPage />} />
                <Route path="polling" element={<PollingPage />} />
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
