import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showLanguageToggle?: boolean;
  showLogout?: boolean;
}

export function PageHeader({
  showLogout = false,
}: PageHeaderProps) {
  const handleLogout = () => {
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
    <div className="bg-white px-4 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-lg font-bold text-gray-800">Saasan</p>
          {/* {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )} */}
        </div>
        <div className="flex items-center space-x-2">
          {showLogout && (
            <Button
              onClick={() => {
                console.log("Logout button pressed!");
                handleLogout();
              }}
              className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 active:bg-red-200 border border-red-200 flex items-center"
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
