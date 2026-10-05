import { ShimmerBlock } from "@/components/Shimmer";
import { formatDate } from "@/lib/formatDate";
import type { NoticeItem } from "@/types/notice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

const card = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
} as const;

export function NoticeCard({ item }: { item: NoticeItem }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/notice/${item.id}`)}
      className="mb-3 flex-row items-start rounded-2xl bg-white p-4 active:opacity-90"
      style={card}
    >
      <View className="h-11 w-11 items-center justify-center rounded-full bg-blue-50">
        <Ionicons name="notifications" size={20} color="#2563EB" />
      </View>
      <View className="ml-3 flex-1">
        <Text
          numberOfLines={2}
          className="text-[14px] font-semibold leading-5 text-slate-800"
        >
          {item.title}
        </Text>
        <View className="mt-2 flex-row items-center">
          <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
          <Text className="ml-1 text-[11px] text-slate-400">
            {formatDate(item.publishDate)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function NoticeCardSkeleton() {
  return (
    <View
      className="mb-3 flex-row items-start rounded-2xl bg-white p-4"
      style={card}
    >
      <ShimmerBlock style={{ width: 44, height: 44, borderRadius: 22 }} />
      <View className="ml-3 flex-1">
        <ShimmerBlock style={{ height: 13, width: "90%", marginBottom: 6 }} />
        <ShimmerBlock style={{ height: 13, width: "60%", marginBottom: 10 }} />
        <ShimmerBlock style={{ height: 10, width: 80 }} />
      </View>
    </View>
  );
}
