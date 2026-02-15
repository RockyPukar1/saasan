import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "./screens/Protected/HomeScreen";
import ProtectedLayout from "./screens/Protected/ProtectedLayout";
import ReportsScreen from "./screens/Protected/ReportsScreen";

import LoginScreen from "./screens/NonProtected/LoginScreen";
import PoliticiansScreen from "./screens/Protected/PoliticiansScreen";
import RegisterScreen from "./screens/NonProtected/RegisterScreen";
import PollsScreen from "./screens/Protected/PollsScreen";
import PoliticianDetailScreen from "./screens/Protected/PoliticiansScreen/PoliticianDetailScreen";

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
        path: "/politicians",
        element: <PoliticiansScreen />,
      },
      {
        path: "/politicians/:politicianId",
        element: <PoliticianDetailScreen />,
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
