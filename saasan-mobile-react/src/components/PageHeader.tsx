import { LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useAuthContext } from "@/contexts/AuthContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showLanguageToggle?: boolean;
  showLogout?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  showLogout = false,
}: PageHeaderProps) {
  const { logout } = useAuthContext();
  const handleLogout = () => {
    logout();
    // console.log("Logout button clicked, platform:", Platform.OS);
    // if (Platform.OS === "web") {
    //   // For web, use confirm instead of Alert
    //   const confirmed = window.confirm(
    //     `${t("auth.logout") || "Logout"}\n\n${
    //       t("auth.logoutConfirm") || "Are you sure you want to logout?"
    //     }`
    //   );
    //   console.log("Web confirm result:", confirmed);
    //   if (confirmed) {
    //     logout();
    //   }
    // } else {
    //   Alert.alert(
    //     t("auth.logout") || "Logout",
    //     t("auth.logoutConfirm") || "Are you sure you want to logout?",
    //     [
    //       { text: t("common.cancel") || "Cancel", style: "cancel" },
    //       {
    //         text: t("auth.logout") || "Logout",
    //         style: "destructive",
    //         onPress: logout,
    //       },
    //     ]
    //   );
    // }
  };

  return (
    <div className="border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur lg:border-b-0 lg:bg-transparent lg:px-8 lg:py-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-500 lg:mb-2">
            Citizen Portal
          </p>
          <h1 className="text-xl font-bold text-gray-900 lg:text-4xl">
            {title || "Saasan"}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600 lg:max-w-2xl lg:text-base">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {showLogout && (
            <Button
              onClick={() => {
                console.log("Logout button pressed!");
                handleLogout();
              }}
              className="flex items-center rounded-xl border border-red-200 bg-red-50 px-3 py-2 hover:bg-red-100 active:bg-red-200 lg:px-4 lg:py-2.5"
            >
              <LogOut className="text-red-600 w-4 h-4" />
              <p className="text-red-600 text-sm font-medium ml-1">
                Logout
              </p>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
