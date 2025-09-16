import React from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import { cn } from "~/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Badge({
  children,
  variant = "default",
  className = "",
  style,
  textStyle,
}: BadgeProps) {
  const baseClasses = "px-2 py-1 rounded-full flex-row items-center";

  const variantClasses = {
    default: "bg-blue-100",
    secondary: "bg-gray-100",
    destructive: "bg-red-100",
    outline: "border border-gray-300 bg-transparent",
  };

  const textVariantClasses = {
    default: "text-blue-800",
    secondary: "text-gray-800",
    destructive: "text-red-800",
    outline: "text-gray-800",
  };

  return (
    <View
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    >
      <Text
        className={cn("text-xs font-medium", textVariantClasses[variant])}
        style={textStyle}
      >
        {children}
      </Text>
    </View>
  );
}
