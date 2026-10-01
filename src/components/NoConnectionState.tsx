import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function NoConnectionState({
  message = "Check your internet connection and try again.",
}: {
  message?: string;
}) {
  return (
    <View className="flex-1 items-center justify-center px-10">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-slate-200">
        <Ionicons name="cloud-offline-outline" size={36} color="#94A3B8" />
      </View>
      <Text className="mt-4 text-center text-base font-bold text-slate-700">
        No Connection
      </Text>
      <Text className="mt-1 text-center text-[13px] leading-5 text-slate-400">
        {message}
      </Text>
    </View>
  );
}
