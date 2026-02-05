import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "./screens/Protected/HomeScreen";
import ProtectedLayout from "./screens/Protected/ProtectedLayout";
import ReportsScreen from "./screens/Protected/Reports";

import LoginScreen from "./screens/NonProtected/LoginScreen";
import PoliticiansScreen from "./screens/Protected/PoliticiansScreen";
import RegisterScreen from "./screens/NonProtected/RegisterScreen";
import PollsScreen from "./screens/Protected/PollsScreen";

export const router = createBrowserRouter([
  {
    element: <ProtectedLayout />,
    children: [
      {
        path: "/",
        element: <HomeScreen />
      },
      {
        path: "/polls",
        element: <PollsScreen />
      },
      {
        path: "/reports",
        element: <ReportsScreen />
      },
      {
        path: "/politicians",
        element: <PoliticiansScreen />
      }
    ]
  },
  {
    path: "/login",
    element: <LoginScreen />
  },
  {
    path: "/register",
    element: <RegisterScreen />
  }
])