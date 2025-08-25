import { ActivityIndicator, Text, View } from "react-native";

export default function Loading() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <ActivityIndicator size="large" color="#DC2626" />
      <Text className="mt-4 text-gray-600">Loading...</Text>
    </View>
  );
}
