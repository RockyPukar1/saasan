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
  Flag,
  Clock,
  AlertTriangle,
  Eye,
  EyeOff,
  Globe,
  MapPin,
  TrendingUp,
  Tag,
  CheckCircle,
  Shield,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Politicians", href: "/politicians", icon: Users },
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
  // { name: "Major Cases", href: "/major-cases", icon: AlertTriangle },
  // { name: "Geographic", href: "/geographic", icon: MapPin },
  { name: "Polling", href: "/polling", icon: BarChart3 },
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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <div className="flex h-16 items-center justify-between px-4 bg-saasan-red">
            <h1 className="text-xl font-bold text-white">Saasan Admin</h1>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-red-500"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
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
                            className="w-full justify-start pl-2"
                            onClick={() => {
                              navigate(child.href);
                              setSidebarOpen(false);
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
                  {user?.full_name}
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
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
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
                  {user?.full_name}
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
        <div className="lg:hidden flex h-16 items-center justify-between px-4 bg-saasan-red border-b border-red-600">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-red-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-lg font-semibold text-white">Saasan Admin</h1>
          <div className="h-8 w-8" /> {/* Spacer */}
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
