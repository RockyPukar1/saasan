import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Tag,
  CheckCircle,
  Shield,
  MapPin,
  Building,
  Wallet,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Politicians", href: "/politicians", icon: Users },
  { name: "Parties", href: "/parties", icon: Building },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
    children: [
      { name: "Report Types", href: "/reports/types", icon: Tag },
      { name: "Report Statuses", href: "/reports/statuses", icon: CheckCircle },
      {
        name: "Report Priorities",
        href: "/reports/priorities",
        icon: AlertTriangle,
      },
      {
        name: "Report Visibilities",
        href: "/reports/visibilities",
        icon: Shield,
      },
    ],
  },
  { name: "Historical Events", href: "/historical-events", icon: Calendar },
  { name: "Major Cases", href: "/major-cases", icon: AlertTriangle },
  { name: "Geography", href: "/geography", icon: MapPin },
  { name: "Polling", href: "/polling", icon: BarChart3 },
  { name: "Users", href: "/users", icon: Users },
  { name: "Role Permissions", href: "/role-permissions", icon: Shield },
  { name: "Sessions", href: "/sessions", icon: Shield },
  { name: "Jobs", href: "/jobs", icon: Workflow },
  { name: "Budget", href: "/budget", icon: Wallet },
  // { name: "Viral Management", href: "/viral-management", icon: TrendingUp },
];

export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(["Reports"]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const currentPath = location.pathname;

  const handleNavigation = (itemName: string, href: string) => {
    // If clicking on a main menu item (not Reports), close all expanded items
    if (itemName !== "Reports") {
      setExpandedItems([]);
    }

    // If clicking on Reports, expand it
    if (itemName === "Reports") {
      setExpandedItems(["Reports"]);
    }

    navigate(href);
    setSidebarOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#f6f8fc]">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm"
          onClick={closeSidebar}
        />
        <div className="fixed inset-y-0 left-0 flex w-[20rem] max-w-[88vw] flex-col bg-white shadow-2xl">
          <div className="border-b border-red-100 bg-gradient-to-br from-red-700 via-red-600 to-orange-500 px-5 py-6 text-white">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-100">
                  Admin Portal
                </p>
                <h1 className="text-2xl font-bold text-white">Saasan</h1>
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-red-50">Signed in as</p>
              <p className="mt-1 text-base font-semibold">
                {user?.fullName || "Administrator"}
              </p>
              <p className="mt-1 text-sm text-red-100">
                Manage platform data, moderation, access, and system settings.
              </p>
            </div>
          </div>
          <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
            <p className="text-sm font-medium text-slate-600">Navigation</p>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:bg-slate-100"
              onClick={closeSidebar}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;
              const hasChildren = item.children && item.children.length > 0;
              const isChildActive = item.children?.some(
                (child) => currentPath === child.href,
              );
              const isExpanded = expandedItems.includes(item.name);

              return (
                <div key={item.name}>
                  <Button
                    variant={isActive || isChildActive ? "default" : "ghost"}
                    className="w-full justify-start rounded-xl"
                    onClick={() => {
                      handleNavigation(item.name, item.href);
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                    {hasChildren && <ChevronDown className="ml-2 h-4 w-4" />}
                  </Button>

                  {/* Submenu */}
                  {hasChildren && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const childIsActive = currentPath === child.href;
                        return (
                          <Button
                            key={child.name}
                            variant={childIsActive ? "default" : "ghost"}
                            className="w-full justify-start rounded-xl pl-2"
                            onClick={() => {
                              navigate(child.href);
                              closeSidebar();
                            }}
                          >
                            <ChevronRight className="mr-2 h-4 w-4" />
                            {child.name}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-4 bg-saasan-red">
            <h1 className="text-xl font-bold text-white">Saasan Admin</h1>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;
              const hasChildren = item.children && item.children.length > 0;
              const isChildActive = item.children?.some(
                (child) => currentPath === child.href,
              );
              const isExpanded = expandedItems.includes(item.name);

              return (
                <div key={item.name}>
                  <Button
                    variant={isActive || isChildActive ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      handleNavigation(item.name, item.href);
                    }}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Button>

                  {/* Submenu */}
                  {hasChildren && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => {
                        const childIsActive = currentPath === child.href;
                        return (
                          <Button
                            key={child.name}
                            variant={childIsActive ? "default" : "ghost"}
                            className="w-full justify-start pl-2"
                            onClick={() => {
                              navigate(child.href);
                            }}
                          >
                            <child.icon className="mr-3 h-5 w-5" />
                            {child.name}
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {user?.fullName}
                </p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden border-b border-red-100 bg-white/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-700 hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-500">
                Admin Portal
              </p>
              <h1 className="text-lg font-semibold text-slate-900">
                Saasan
              </h1>
            </div>
          <div className="h-8 w-8" /> {/* Spacer */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
