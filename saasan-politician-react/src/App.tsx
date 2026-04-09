import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { Layout } from "@/components/layout/Layout";
import { DashboardScreen } from "@/screens/DashboardScreen";
import { MessagesScreen } from "@/screens/MessagesScreen";
import { PromisesScreen } from "@/screens/PromisesScreen";
import { AnnouncementsScreen } from "@/screens/AnnouncementsScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
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
              <Route path="/login" element={<LoginForm />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/" replace />} />
                <Route path="/" element={<DashboardScreen />} />
                <Route path="/messages" element={<MessagesScreen />} />
                <Route path="/promises" element={<PromisesScreen />} />
                <Route
                  path="/announcements"
                  element={<AnnouncementsScreen />}
                />
                <Route path="/profile" element={<ProfileScreen />} />
                <Route path="/settings" element={<SettingsScreen />} />
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
