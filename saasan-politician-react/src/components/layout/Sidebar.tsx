import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  Target,
  Megaphone,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
  mobile?: boolean;
}

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Messages", href: "/messages", icon: MessageSquare },
  { name: "Promises", href: "/promises", icon: Target },
  { name: "Announcements", href: "/announcements", icon: Megaphone },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className, onNavigate, mobile = false }: SidebarProps) {
  const { user, logout } = useAuth();

  return (
    <div
      className={cn(
        "flex h-full w-72 flex-col border-r bg-card",
        mobile && "w-[20rem] max-w-[88vw]",
        className,
      )}
    >
      <div className="border-b border-red-100 bg-gradient-to-br from-red-700 via-red-600 to-orange-500 px-6 py-7 text-white">
        <p className="text-xs uppercase tracking-[0.2em] text-red-100">
          Politician Portal
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Saasan</h1>
        <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
          <p className="text-sm text-red-50">Signed in as</p>
          <p className="mt-1 text-base font-semibold">
            {user?.fullName || "Representative"}
          </p>
          <p className="mt-1 text-sm text-red-100">
            Review messages, manage your public profile, and track outreach.
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start rounded-2xl text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => {
            logout();
            onNavigate?.();
          }}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Logout
        </Button>
      </div>
    </div>
  );
}
