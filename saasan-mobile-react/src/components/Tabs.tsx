import { useLocation, Link } from "react-router-dom";
import {
  Home,
  Users,
  FileText,
  Vote,
  LogOut,
  Scale,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

interface TabsProps {
  isDesktopSidebarCollapsed: boolean;
  onDesktopSidebarToggle: () => void;
}

const Tabs = ({
  isDesktopSidebarCollapsed,
  onDesktopSidebarToggle,
}: TabsProps) => {
  const location = useLocation();
  const { user, logout } = useAuthContext();

  const tabs = [
    {
      name: "index",
      title: "Home",
      icon: Home,
      path: "/",
      description: "Civic overview",
    },
    {
      name: "Politics",
      title: "Politics",
      icon: Users,
      path: "/politics",
      description: "Leaders and parties",
    },
    {
      name: "reports",
      title: "Reports",
      icon: FileText,
      path: "/reports",
      description: "Submit and track",
    },
    {
      name: "polls",
      title: "Polls",
      icon: Vote,
      path: "/polls",
      description: "Public opinion",
    },
  ];

  const isActiveTab = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <aside
        className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:flex-col lg:border-r lg:border-red-100 lg:bg-white lg:transition-[width] lg:duration-300 ${
          isDesktopSidebarCollapsed ? "lg:w-22" : "lg:w-72"
        }`}
      >
        <div
          className={`border-b border-red-100 bg-gradient-to-br from-red-700 via-red-600 to-orange-500 py-7 text-white ${
            isDesktopSidebarCollapsed ? "px-4" : "px-6"
          }`}
        >
          <div
            className={`mb-6 flex items-center ${
              isDesktopSidebarCollapsed ? "justify-center" : "gap-3"
            }`}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Scale className="h-6 w-6" />
            </div>
            {!isDesktopSidebarCollapsed && (
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-red-100">
                  Citizen Portal
                </p>
                <h1 className="text-2xl font-semibold">Saasan</h1>
              </div>
            )}
          </div>

          <div
            className={`rounded-2xl border border-white/15 bg-white/10 backdrop-blur ${
              isDesktopSidebarCollapsed ? "p-3" : "p-4"
            }`}
          >
            <div
              className={`flex items-center ${
                isDesktopSidebarCollapsed ? "justify-center" : "justify-between gap-3"
              }`}
            >
              {isDesktopSidebarCollapsed ? (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-100">
                  CP
                </p>
              ) : (
                <div>
                  <p className="text-sm text-red-50">Signed in as</p>
                  <p className="mt-1 text-base font-semibold">
                    {user?.fullName || "Citizen"}
                  </p>
                  <p className="mt-1 text-sm text-red-100">
                    Track reports, follow leaders, and vote in polls.
                  </p>
                </div>
              )}

              <button
                type="button"
                aria-label={
                  isDesktopSidebarCollapsed
                    ? "Expand desktop sidebar"
                    : "Collapse desktop sidebar"
                }
                onClick={onDesktopSidebarToggle}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white transition-colors hover:bg-white/25"
              >
                {isDesktopSidebarCollapsed ? (
                  <PanelLeftOpen className="h-5 w-5" />
                ) : (
                  <PanelLeftClose className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <nav className={`flex-1 space-y-2 py-5 ${isDesktopSidebarCollapsed ? "px-3" : "px-4"}`}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = isActiveTab(tab.path);

            return (
              <Link
                key={tab.name}
                to={tab.path}
                title={tab.title}
                className={`group flex rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? "border-red-200 bg-red-50 text-red-700 shadow-sm"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                } ${isDesktopSidebarCollapsed ? "items-center justify-center px-3 py-4" : "items-center gap-4 px-4 py-4"}`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                  }`}
                >
                  <Icon size={20} />
                </div>
                {!isDesktopSidebarCollapsed && (
                  <div>
                    <p className="font-semibold">{tab.title}</p>
                    <p className="text-sm text-slate-500">{tab.description}</p>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={`border-t border-slate-200 py-4 ${isDesktopSidebarCollapsed ? "px-3" : "px-4"}`}>
          <button
            type="button"
            onClick={() => logout()}
            title="Logout"
            className={`flex w-full rounded-2xl text-left text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700 ${
              isDesktopSidebarCollapsed
                ? "items-center justify-center px-3 py-3"
                : "items-center gap-3 px-4 py-3"
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
              <LogOut className="h-5 w-5" />
            </div>
            {!isDesktopSidebarCollapsed && (
              <div>
                <p className="font-medium">Logout</p>
                <p className="text-sm text-slate-500">End this session</p>
              </div>
            )}
          </button>
        </div>
      </aside>

      <div className="fixed bottom-1 left-1 right-1 z-50 rounded-2xl border-t border-gray-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.1)] lg:hidden">
        <div className="flex h-full items-center justify-around px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = isActiveTab(tab.path);

            return (
              <Link
                key={tab.name}
                to={tab.path}
                className={`flex flex-1 flex-col items-center justify-center py-2 transition-colors duration-200 ${
                  isActive ? "text-red-600" : "text-gray-500"
                } hover:text-red-500`}
              >
                <Icon
                  size={24}
                  className={isActive ? "text-red-600" : "text-gray-500"}
                />
                <span
                  className={`mt-1 text-xs font-medium ${
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
    </>
  );
};

export default Tabs;
