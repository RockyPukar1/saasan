import { createBrowserRouter } from "react-router-dom";
import HomeScreen from "./pages/Protected/Home";
import ProtectedLayout from "./pages/Protected/ProtectedLayout";
import PollScreen from "./pages/Protected/Polls";
import ReportsScreen from "./pages/Protected/Reports";

import LoginScreen from "./pages/NonProtected/Login";
import PoliticiansScreen from "./pages/Protected/Politicians";

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
        element: <PollScreen />
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
  }
])