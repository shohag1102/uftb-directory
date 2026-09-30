import { useEffect } from "react";
import { Text, View } from "react-native";

type Props = {
  onFinish: () => void;
};

export default function CustomSplashScreen({ onFinish }: Props) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View className="absolute inset-0 items-center justify-center bg-blue-900">
      <Text className="text-3xl font-bold text-white">UFTB Info</Text>
    </View>
  );
}
