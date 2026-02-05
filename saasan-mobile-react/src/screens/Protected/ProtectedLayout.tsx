import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import Tabs from "../../components/Tabs";

export default function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuthContext();
  
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

  // Check if user is admin
  // if (user?.role !== "admin") {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold text-red-600 mb-4">
  //           Access Denied
  //         </h1>
  //         <p className="text-gray-600 mb-4">
  //           This dashboard is only accessible to administrators.
  //         </p>
  //         <button
  //           onClick={() => (window.location.href = "/")}
  //           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  //         >
  //           Go to Mobile App
  //         </button>
  //       </div>
  //     </div>
  //   );
  // }

  return <>
    <div className="pb-20">
      <Outlet />
    </div>
    <Tabs />
  </>;
};
