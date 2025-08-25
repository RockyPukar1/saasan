import { AlertTriangle } from "lucide-react-native";
import { Text, View } from "react-native";
import { Button } from "./ui/button";

interface Props {
  error: string;
  refresh: () => void;
}

export default function Error({ error, refresh }: Props) {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50 px-4">
      <AlertTriangle className="text-red-500 mb-4" size={48} />
      <Text className="text-red-600 text-lg font-bold mb-2">
        Error Loading Data
      </Text>
      <Text className="text-gray-600 text-center mb-4">{error}</Text>
      <Button onPress={refresh} className="bg-red-600">
        <Text className="text-white font-bold">Retry</Text>
      </Button>
    </View>
  );
}
