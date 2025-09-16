import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useLanguage } from "~/contexts/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <View className="flex-row bg-gray-100 rounded-full p-1">
      <TouchableOpacity
        onPress={() => setLanguage("en")}
        className={`px-3 py-1 rounded-full ${
          language === "en" ? "bg-white shadow-sm" : ""
        }`}
      >
        <Text
          className={`text-xs font-medium ${
            language === "en" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          En
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setLanguage("ne")}
        className={`px-3 py-1 rounded-full ${
          language === "ne" ? "bg-white shadow-sm" : ""
        }`}
      >
        <Text
          className={`text-xs font-medium ${
            language === "ne" ? "text-blue-600" : "text-gray-600"
          }`}
        >
          Nep
        </Text>
      </TouchableOpacity>
    </View>
  );
}
