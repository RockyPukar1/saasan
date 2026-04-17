import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "./screens/Protected/HomeScreen";
import ProtectedLayout from "./screens/Protected/ProtectedLayout";
import ReportsScreen from "./screens/Protected/ReportsScreen";

import LoginScreen from "./screens/NonProtected/LoginScreen";
import PoliticsScreen from "./screens/Protected/PoliticsScreen";
import RegisterScreen from "./screens/NonProtected/RegisterScreen";
import PollsScreen from "./screens/Protected/PollsScreen";
import PartyDetailsScreen from "./screens/Protected/PoliticsScreen/PartiesScreen/PartyDetailsScreen";
import ReportDetailScreen from "./screens/Protected/ReportsScreen/ReportDetailScreen";
import PoliticianDetailScreen from "./screens/Protected/PoliticsScreen/PoliticiansScreen/PoliticianDetailScreen";
import PoliticiansScreen from "./screens/Protected/PoliticsScreen/PoliticiansScreen";
import PartiesScreen from "./screens/Protected/PoliticsScreen/PartiesScreen";
import BudgetScreen from "./screens/Protected/PoliticsScreen/BudgetScreen";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permission.constants";

export const router = createBrowserRouter([
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute requiredRole="citizen">
            <HomeScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "/polls",
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.polls.view}>
            <PollsScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "/reports",
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.reports.viewOwn}>
            <ReportsScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "/reports/:reportId",
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.reports.viewOwn}>
            <ReportDetailScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "/politics",
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.politicians.view}>
            <PoliticsScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "/politics/politicians",
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.politicians.view}>
            <PoliticiansScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "/politics/politician/:politicianId",
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.politicians.view}>
            <PoliticianDetailScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "/politics/parties",
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.parties.view}>
            <PartiesScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "/politics/party/:partyId",
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.parties.view}>
            <PartyDetailsScreen />
          </ProtectedRoute>
        ),
      },
      {
        path: "/politics/budget",
        element: (
          <ProtectedRoute requiredPermission={PERMISSIONS.politicians.view}>
            <BudgetScreen />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginScreen />,
  },
  {
    path: "/register",
    element: <RegisterScreen />,
  },
]);
