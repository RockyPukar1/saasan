import { useLocation, Link } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  Vote,
} from "lucide-react";

const Tabs = () => {
  const location = useLocation();

  const tabs = [
    {
      name: "index",
      title: "Home",
      icon: Home,
      path: "/",
    },
    // {
    //   name: "viral",
    //   title: "Viral",
    //   icon: TrendingUp,
    //   path: "/viral",
    // },
    {
      name: "politicians",
      title: "Leaders",
      icon: Users,
      path: "/politicians",
    },
    {
      name: "reports",
      title: "Reports",
      icon: FileText,
      path: "/reports",
    },
    {
      name: "polls",
      title: "Polls",
      icon: Vote,
      path: "/polls",
    },
  ];

  const isActiveTab = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="fixed bottom-1 left-1 right-1 bg-white border-t border-gray-200 z-50 rounded-2xl h-18 shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
    >
      <div className="flex justify-around items-center h-full px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isActiveTab(tab.path);
          
          return (
            <Link
              key={tab.name}
              to={tab.path}
              className={`flex flex-col items-center justify-center flex-1 py-2 transition-colors duration-200 ${
                isActive ? "text-red-600" : "text-gray-500"
              } hover:text-red-500`}
            >
              <Icon
                size={24}
                className={isActive ? "text-red-600" : "text-gray-500"}
              />
              <span
                className={`text-xs mt-1 font-medium ${
                  isActive ? "text-red-600" : "text-gray-500"
                }`}
              >
                {tab.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
