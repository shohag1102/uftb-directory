import { Text, View } from "react-native";

export default function About() {
  return (
    <View className="flex-1 items-center justify-center bg-orange-200">
      <Text className="text-4xl text-blue-400">About</Text>
      <Text className="text-3xl text-orange-400">Reading list app</Text>
    </View>
  );
}
