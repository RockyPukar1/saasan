import type { ReactNode } from "react";
import type { To } from "react-router-dom";
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
  backTo?: To;
}

export function PageHeader({
  title,
  subtitle,
  showBackButton = false,
  showLogout = false,
  rightAction,
  backButtonVariant = "ghost",
  backButtonShowText = false,
  backTo,
}: PageHeaderProps) {
  const { logout } = useAuthContext();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-8 lg:py-5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3">
          {showBackButton && (
            <BackButton
              className="lg:hidden"
              variant={backButtonVariant}
              showText={backButtonShowText}
              to={backTo}
            />
          )}
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 lg:text-3xl">{title}</h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600 lg:text-base">{subtitle}</p>
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
