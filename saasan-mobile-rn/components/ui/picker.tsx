import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ChevronDown } from "lucide-react-native";

interface CustomPickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: Array<{ label: string; value: string }>;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export function CustomPicker({
  label,
  value,
  onValueChange,
  items,
  placeholder = "Select an option",
  error,
  required,
}: CustomPickerProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-foreground mb-1">
        {label}
        {required && <Text className="text-red-500"> *</Text>}
      </Text>
      <View className="relative">
        <View className="bg-input rounded-lg overflow-hidden">
          <Picker
            selectedValue={value}
            onValueChange={onValueChange}
            style={{
              backgroundColor: "transparent",
              color: value ? "#000" : "#666",
            }}
          >
            <Picker.Item label={placeholder} value="" enabled={!required} />
            {items.map((item) => (
              <Picker.Item
                key={item.value}
                label={item.label}
                value={item.value}
              />
            ))}
          </Picker>
          <View className="absolute right-3 top-0 bottom-0 justify-center">
            <ChevronDown size={20} className="text-gray-500" />
          </View>
        </View>
      </View>
      {error && <Text className="text-sm text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
