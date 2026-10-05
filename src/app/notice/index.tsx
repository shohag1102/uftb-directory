import NoConnectionState from "@/components/NoConnectionState";
import { NoticeCard, NoticeCardSkeleton } from "@/components/NoticeCard";
import { useMinDelay } from "@/hooks/useMinDelay";
import { useInfiniteNotices } from "@/hooks/useNotices";
import type { NoticeItem } from "@/types/notice";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

export default function NoticeListScreen() {
  const {
    items,
    loading: rawLoading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    reload,
  } = useInfiniteNotices(10);
  const loading = useMinDelay(rawLoading, 700);
  const [refreshing, setRefreshing] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const listRef = useRef<FlatList<NoticeItem>>(null);

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
            title: "UFTB Notices",
            hideMenuButton: false,
            rightHref: "/",
            onRefresh,
            refreshing,
          } as any
        }
      />

      {loading && items.length === 0 && (
        <View className="px-5 pt-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <NoticeCardSkeleton key={i} />
          ))}
        </View>
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
            renderItem={({ item }) => <NoticeCard item={item} />}
            ListFooterComponent={
              loadingMore ? (
                <View className="items-center py-5">
                  <ActivityIndicator color="#2563EB" />
                </View>
              ) : !hasMore ? (
                <View className="items-center py-6">
                  <View className="mb-2 h-px w-16 bg-slate-300" />
                  <Text className="text-xs font-semibold text-slate-400">
                    End of notices
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
