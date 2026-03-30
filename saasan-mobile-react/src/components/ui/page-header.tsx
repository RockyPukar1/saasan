import type { ReactNode } from "react";
import { BackButton } from "./back-button";
import { Button } from "./button";
import { LogOut } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showLogout?: boolean;
  rightAction?: ReactNode;
  backButtonVariant?: "ghost" | "outline" | "default";
  backButtonShowText?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  showBackButton = false,
  showLogout = false,
  rightAction,
  backButtonVariant = "ghost",
  backButtonShowText = false,
}: PageHeaderProps) {
  const { logout } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-white px-4 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {showBackButton && (
            <BackButton
              variant={backButtonVariant}
              showText={backButtonShowText}
            />
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {rightAction}
          {showLogout && (
            <Button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 active:bg-red-200 border border-red-200 flex items-center"
            >
              <LogOut className="text-red-600 w-4 h-4" />
              <span className="text-red-600 text-sm font-medium ml-1">
                Logout
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
