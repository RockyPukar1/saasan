import { View } from "react-native";

export default function BottomGap({ gap = 20 }: { gap?: number }) {
  return <View className={`h-${gap}`} />;
}
