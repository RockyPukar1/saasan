import React from "react";
import { View, Text, TouchableOpacity, Alert, Platform } from "react-native";
import { LogOut } from "lucide-react-native";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "~/contexts/LanguageContext";
import { useAuthContext } from "~/contexts/AuthContext";
import { Button } from "./ui/button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showLanguageToggle?: boolean;
  showLogout?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  showLanguageToggle = true,
  showLogout = false,
}: PageHeaderProps) {
  const { t } = useLanguage();
  const { logout } = useAuthContext();

  const handleLogout = () => {
    console.log("Logout button clicked, platform:", Platform.OS);
    if (Platform.OS === "web") {
      // For web, use confirm instead of Alert
      const confirmed = window.confirm(
        `${t("auth.logout") || "Logout"}\n\n${
          t("auth.logoutConfirm") || "Are you sure you want to logout?"
        }`
      );
      console.log("Web confirm result:", confirmed);
      if (confirmed) {
        logout();
      }
    } else {
      Alert.alert(
        t("auth.logout") || "Logout",
        t("auth.logoutConfirm") || "Are you sure you want to logout?",
        [
          { text: t("common.cancel") || "Cancel", style: "cancel" },
          {
            text: t("auth.logout") || "Logout",
            style: "destructive",
            onPress: logout,
          },
        ]
      );
    }
  };

  return (
    <View className="bg-white px-4 py-3 border-b border-gray-200">
      <View className="flex-row items-center justify-end">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">Saasan</Text>
          {/* {subtitle && (
            <Text className="text-sm text-gray-600 mt-1">{subtitle}</Text>
          )} */}
        </View>
        <View className="flex-row items-center space-x-2">
          {showLanguageToggle && <LanguageToggle />}
          {showLogout && (
            <Button
              onPress={() => {
                console.log("Logout button pressed!");
                handleLogout();
              }}
              className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 active:bg-red-200 border border-red-200 flex-row items-center"
              accessible={true}
              accessibilityLabel="Logout"
              accessibilityRole="button"
            >
              <LogOut className="text-red-600" size={16} />
              {Platform.OS === "web" && (
                <Text className="text-red-600 text-sm font-medium ml-1">
                  Logout
                </Text>
              )}
            </Button>
          )}
        </View>
      </View>
    </View>
  );
}
