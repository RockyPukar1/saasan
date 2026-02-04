import React from "react";
import { View, Text } from "react-native";
import { Sun } from "lucide-react";

export default function ThemeToggle() {
  return (
    <div className="flex-row items-center bg-yellow-100 px-3 py-2 rounded-lg">
      <Sun className="text-yellow-600" size={16} />
      <p className="text-yellow-800 text-sm font-medium ml-2">
        Light Mode
      </p>
    </div>
  );
}
