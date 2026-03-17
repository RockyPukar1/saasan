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

export const router = createBrowserRouter([
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        element: <HomeScreen />,
      },
      {
        path: "/polls",
        element: <PollsScreen />,
      },
      {
        path: "/reports",
        element: <ReportsScreen />,
      },
      {
        path: "/reports/:reportId",
        element: <ReportDetailScreen />,
      },
      {
        path: "/politics",
        element: <PoliticsScreen />,
      },
      {
        path: "/politics/politicians",
        element: <PoliticiansScreen />,
      },
      {
        path: "/politics/politician/:politicianId",
        element: <PoliticianDetailScreen />,
      },
      {
        path: "/politics/parties",
        element: <PartiesScreen />,
      },
      {
        path: "/politics/party/:partyId",
        element: <PartyDetailsScreen />,
      },
      {
        path: "/politics/budget",
        element: <BudgetScreen />,
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
