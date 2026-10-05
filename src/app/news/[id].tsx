import NoConnectionState from "@/components/NoConnectionState";
import ShareSheet from "@/components/ShareSheet";
import { ShimmerBlock } from "@/components/Shimmer";
import { useMinDelay } from "@/hooks/useMinDelay";
import { useNewsDetail } from "@/hooks/useNews";
import { formatDate } from "@/lib/formatDate";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import { newsUrl } from "@/lib/share"; // was from '@/lib/newsShare'
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

function DetailSkeleton() {
  return (
    <View className="flex-1">
      <ShimmerBlock style={{ height: 230 }} />
      <View className="px-5 pt-5">
        <ShimmerBlock style={{ height: 12, width: 100, marginBottom: 12 }} />
        <ShimmerBlock style={{ height: 20, width: "90%", marginBottom: 8 }} />
        <ShimmerBlock style={{ height: 20, width: "60%", marginBottom: 20 }} />
        {[1, 2, 3, 4].map((i) => (
          <ShimmerBlock
            key={i}
            style={{ height: 12, width: "100%", marginBottom: 10 }}
          />
        ))}
      </View>
    </View>
  );
}

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { item, loading: rawLoading, error } = useNewsDetail(id);
  const loading = useMinDelay(rawLoading, 700);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <View className="flex-1 bg-slate-100">
      <Stack.Screen
        options={
          {
            title: "News Details",
            hideMenuButton: true,
            rightHref: "/news",
            rightIcon: "list",
          } as any
        }
      />

      {loading && <DetailSkeleton />}
      {!loading && error && <NoConnectionState message={error} />}

      {!loading && !error && item && (
        <>
          <ScrollView
            contentContainerClassName="pb-8"
            showsVerticalScrollIndicator={false}
          >
            <View className="px-5 pt-5">
              <Text className="text-xl font-bold leading-7 text-slate-900">
                {item.title}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={14} color="#64748B" />
                <Text className="ml-1.5 text-xs font-semibold text-slate-500">
                  {formatDate(item.publishDate)}
                </Text>
              </View>
            </View>

            <View
              style={{
                height: 220,
                marginTop: 16,
                marginHorizontal: 20,
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: resolveImageUrl(item.image) }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>

            <View className="px-5 pt-5">
              <View className="mt-0">
                {item.description ? (
                  item.description
                    .split(/\r?\n\r?\n/)
                    .filter(Boolean)
                    .map((p, i) => (
                      <Text
                        key={i}
                        className="mb-3 text-[14px] leading-6 text-slate-600"
                      >
                        {p.trim()}
                      </Text>
                    ))
                ) : (
                  <Text className="text-[14px] italic text-slate-400">
                    No additional details available.
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>

          <Pressable
            onPress={() => setShareOpen(true)}
            className="absolute bottom-6 right-5 h-14 w-14 items-center justify-center rounded-full active:opacity-90"
            style={{
              backgroundColor: "#1E6FE8",
              shadowColor: "#0B3D91",
              shadowOpacity: 0.35,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 6 },
              elevation: 10,
            }}
          >
            <Ionicons name="share-social" size={22} color="#fff" />
          </Pressable>

          <ShareSheet
            visible={shareOpen}
            onClose={() => setShareOpen(false)}
            title={item.title}
            url={newsUrl(item.id)}
          />
        </>
      )}
    </View>
  );
}
