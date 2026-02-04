import { Text, View } from "lucide-react-native";
import { Button } from "./ui/button";
import { cn } from "~/lib/utils";

interface IEvidencePicker {
  onPress: () => void;
  background: string;
  text: string;
  Icon: any;
}

export default function EvidencePicker({ onPress, background, text, Icon }: IEvidencePicker) {
  return (
    <Button
      className={cn("flex-row items-center justify-center rounded-full py-1 px-3", `bg-${background}-600`)}
      onPress={onPress}
    >
      <View className="flex-row gap-1 items-center">
        {/* <Icon className="text-white mr-2" size={16} color="white" /> */}
        <Text className="text-white">{text}</Text>
      </View>
    </Button>
  )
}