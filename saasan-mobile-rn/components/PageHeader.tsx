import React from "react";
import { View, Text } from "react-native";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "~/contexts/LanguageContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showLanguageToggle?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  showLanguageToggle = true,
}: PageHeaderProps) {
  const { t } = useLanguage();

  return (
    <View className="bg-white px-4 py-3 border-b border-gray-200">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
          {subtitle && (
            <Text className="text-sm text-gray-600 mt-1">{subtitle}</Text>
          )}
        </View>
        {showLanguageToggle && <LanguageToggle />}
      </View>
    </View>
  );
}
