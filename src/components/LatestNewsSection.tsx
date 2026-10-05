import { ShimmerBlock } from "@/components/Shimmer";
import { useMinDelay } from "@/hooks/useMinDelay";
import { useLatestNews } from "@/hooks/useNews";
import { formatDate } from "@/lib/formatDate";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import type { NewsItem } from "@/types/news";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const card = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.07,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
} as const;

function NewsCard({ item, width }: { item: NewsItem; width: number }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/news/${item.id}`)}
      style={{ width }}
      className="mr-4 overflow-hidden rounded-2xl bg-white active:opacity-90"
    >
      <View style={{ height: 160 }}>
        <Image
          source={{ uri: resolveImageUrl(item.image) }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.55)"]}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 64,
          }}
        />
      </View>
      <View className="p-4">
        <Text
          numberOfLines={2}
          className="text-[14px] font-bold leading-5 text-slate-800"
        >
          {item.title}
        </Text>
        <View className="mt-2.5 flex-row items-center">
          <Ionicons name="calendar-outline" size={13} color="#94A3B8" />
          <Text className="ml-1 text-[12px] text-slate-400">
            {formatDate(item.publishDate)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function NewsCardSkeleton({ width }: { width: number }) {
  return (
    <View
      style={{ width }}
      className="mr-4 overflow-hidden rounded-2xl bg-white"
    >
      <ShimmerBlock style={{ height: 160 }} />
      <View className="p-4">
        <ShimmerBlock style={{ height: 13, width: "90%", marginBottom: 7 }} />
        <ShimmerBlock style={{ height: 13, width: "60%", marginBottom: 12 }} />
        <ShimmerBlock style={{ height: 11, width: 75 }} />
      </View>
    </View>
  );
}

export default function LatestNewsSection() {
  const {
    news,
    loading: rawLoading,
    refreshing: rawRefreshing,
    error,
    refresh,
  } = useLatestNews(5);
  const { width } = useWindowDimensions();
  const cardWidth = width * 0.65;

  const loading = useMinDelay(rawLoading, 700);
  const refreshing = useMinDelay(rawRefreshing, 700);

  const showSkeleton = loading || refreshing; // both initial load AND refresh show the skeleton row

  return (
    <View className="mt-7">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-slate-800">Latest News</Text>
        <View className="flex-row items-center">
          <Link href="/news" asChild>
            <Pressable className="mr-2 rounded-full bg-blue-600 px-3.5 py-1.5 active:opacity-80">
              <Text className="text-xs font-bold text-white">View All</Text>
            </Pressable>
          </Link>
          <Pressable
            onPress={refresh}
            disabled={refreshing}
            className="h-8 w-8 items-center justify-center rounded-full bg-blue-100 active:opacity-70"
          >
            {refreshing ? (
              <ActivityIndicator size="small" color="#2563EB" />
            ) : (
              <Ionicons name="refresh" size={16} color="#2563EB" />
            )}
          </Pressable>
        </View>
      </View>

      {showSkeleton ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((i) => (
            <NewsCardSkeleton key={i} width={cardWidth} />
          ))}
        </ScrollView>
      ) : error ? (
        <Text className="text-sm text-slate-400">{error}</Text>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
        >
          {news.map((item) => (
            <NewsCard key={item.id} item={item} width={cardWidth} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
