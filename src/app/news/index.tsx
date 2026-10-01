import NoConnectionState from "@/components/NoConnectionState";
import { ShimmerBlock } from "@/components/Shimmer";
import { useMinDelay } from "@/hooks/useMinDelay";
import { useInfiniteNews } from "@/hooks/useNews";
import { formatDate } from "@/lib/formatDate";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import type { NewsItem } from "@/types/news";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const card = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
} as const;

function NewsListCard({ item }: { item: NewsItem }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/news/${item.id}`)}
      className="overflow-hidden rounded-2xl bg-white active:opacity-90"
      style={card}
    >
      <View style={{ height: 170 }}>
        <Image
          source={{ uri: resolveImageUrl(item.image) }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>
      <View className="p-4">
        <Text
          numberOfLines={2}
          className="text-[15px] font-bold leading-6 text-slate-800"
        >
          {item.title}
        </Text>
        <View className="mt-3 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={13} color="#94A3B8" />
            <Text className="ml-1.5 text-xs text-slate-400">
              {formatDate(item.publishDate)}
            </Text>
          </View>
          <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-50">
            <Ionicons name="arrow-forward" size={16} color="#2563EB" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function NewsListSkeleton() {
  return (
    <View className="mb-4 overflow-hidden rounded-2xl bg-white" style={card}>
      <ShimmerBlock style={{ height: 170 }} />
      <View className="p-4">
        <ShimmerBlock style={{ height: 14, width: "95%", marginBottom: 8 }} />
        <ShimmerBlock style={{ height: 14, width: "70%", marginBottom: 14 }} />
        <ShimmerBlock style={{ height: 10, width: 100 }} />
      </View>
    </View>
  );
}

export default function NewsListScreen() {
  const {
    items,
    loading: rawLoading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    reload,
  } = useInfiniteNews(10);
  const loading = useMinDelay(rawLoading, 700);
  const [refreshing, setRefreshing] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const listRef = useRef<FlatList<NewsItem>>(null);

  const onRefresh = () => {
    setRefreshing(true);
    reload();
  };
  useEffect(() => {
    if (!loading) setRefreshing(false);
  }, [loading]);

  return (
    <View className="flex-1 bg-slate-100">
      <Stack.Screen
        options={
          {
            title: "UFTB News",
            hideMenuButton: true,
            rightHref: "/",
            onRefresh,
            refreshing,
          } as any
        }
      />

      {loading && items.length === 0 && (
        <ScrollView contentContainerClassName="px-5 pt-5 pb-8">
          {[1, 2, 3, 4].map((i) => (
            <NewsListSkeleton key={i} />
          ))}
        </ScrollView>
      )}

      {!loading && error && items.length === 0 && (
        <NoConnectionState message={error} />
      )}

      {items.length > 0 && (
        <>
          <FlatList
            ref={listRef}
            data={items}
            keyExtractor={(i) => i.id}
            contentContainerClassName="px-5 pt-5 pb-8"
            onScroll={(e) => setShowTop(e.nativeEvent.contentOffset.y > 400)}
            scrollEventThrottle={16}
            onEndReached={loadMore}
            onEndReachedThreshold={0.4}
            renderItem={({ item }) => <NewsListCard item={item} />}
            ItemSeparatorComponent={() => <View className="h-4" />}
            ListFooterComponent={
              loadingMore ? (
                <View className="items-center py-5">
                  <ActivityIndicator color="#2563EB" />
                </View>
              ) : !hasMore ? (
                <View className="items-center py-6">
                  <View className="mb-2 h-px w-16 bg-slate-300" />
                  <Text className="text-xs font-semibold text-slate-400">
                    End of news
                  </Text>
                </View>
              ) : null
            }
          />

          {showTop && (
            <Pressable
              onPress={() =>
                listRef.current?.scrollToOffset({ offset: 0, animated: true })
              }
              className="absolute bottom-6 right-5 h-12 w-12 items-center justify-center rounded-full bg-blue-600 active:opacity-90"
              style={{
                shadowColor: "#0B3D91",
                shadowOpacity: 0.35,
                shadowRadius: 10,
                elevation: 8,
              }}
            >
              <Ionicons name="arrow-up" size={22} color="#fff" />
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}
