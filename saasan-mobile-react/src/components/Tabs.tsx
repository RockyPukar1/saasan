import { useLocation, Link } from "react-router-dom";
import { Home, Users, FileText, Vote, LogOut, Scale } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

const Tabs = () => {
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
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-red-100 lg:bg-white">
        <div className="border-b border-red-100 bg-gradient-to-br from-red-700 via-red-600 to-orange-500 px-6 py-7 text-white">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-red-100">
                Citizen Portal
              </p>
              <h1 className="text-2xl font-semibold">Saasan</h1>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm text-red-50">Signed in as</p>
            <p className="mt-1 text-base font-semibold">
              {user?.fullName || "Citizen"}
            </p>
            <p className="mt-1 text-sm text-red-100">
              Track reports, follow leaders, and vote in polls.
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = isActiveTab(tab.path);

            return (
              <Link
                key={tab.name}
                to={tab.path}
                className={`group flex items-center gap-4 rounded-2xl border px-4 py-4 transition-all duration-200 ${
                  isActive
                    ? "border-red-200 bg-red-50 text-red-700 shadow-sm"
                    : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
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
                <div>
                  <p className="font-semibold">{tab.title}</p>
                  <p className="text-sm text-slate-500">{tab.description}</p>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 px-4 py-4">
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
              <LogOut className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Logout</p>
              <p className="text-sm text-slate-500">End this session</p>
            </div>
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
