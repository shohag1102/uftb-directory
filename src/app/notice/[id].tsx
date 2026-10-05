import NoConnectionState from "@/components/NoConnectionState";
import ShareSheet from "@/components/ShareSheet";
import { ShimmerBlock } from "@/components/Shimmer";
import { useNoticeDetail } from "@/hooks/useNotices";
import { formatDate } from "@/lib/formatDate";
import { resolveNoticePdfUrl } from "@/lib/resolveImageUrl";
import { noticeUrl } from "@/lib/share";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import Pdf from "react-native-pdf";

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { item, loading, error } = useNoticeDetail(id);
  const [shareOpen, setShareOpen] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const pdfUrl = item ? resolveNoticePdfUrl(item.pdf) : undefined;

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={
          {
            title: "Details",
            hideMenuButton: true,
            rightHref: "/notice",
            rightIcon: "list",
          } as any
        }
      />

      {loading && (
        <View className="flex-1 px-5 pt-5">
          <ShimmerBlock style={{ height: "100%", borderRadius: 12 }} />
        </View>
      )}

      {!loading && error && <NoConnectionState message={error} />}

      {!loading && !error && item && pdfUrl && (
        <>
          {/* PDF title bar */}
          <View className=" bg-white px-5 py-3">
            <Text
              numberOfLines={2}
              className="text-[15px] font-bold leading-5 text-slate-800"
            >
              {item.title}
            </Text>
            <View className="mt-1.5 flex-row items-center">
              <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
              <Text className="ml-1 text-[11px] text-slate-400">
                {formatDate(item.publishDate)}
              </Text>
            </View>
          </View>

          <View className="flex-1 bg-white">
            <Pdf
              source={{ uri: pdfUrl, cache: true }}
              style={{ flex: 1, backgroundColor: "#FFFFFF" }}
              trustAllCerts={false}
              onLoadComplete={() => setPdfLoading(false)}
              onError={(e) => {
                setPdfLoading(false);
                setPdfError("Could not load this document.");
                console.log("PDF load error:", e);
              }}
            />

            {pdfLoading && (
              <View className="absolute inset-0 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#2563EB" />
                <Text className="mt-3 text-sm text-slate-500">
                  Loading document…
                </Text>
              </View>
            )}

            {pdfError && (
              <View className="absolute inset-0 items-center justify-center bg-white px-10">
                <Ionicons
                  name="document-text-outline"
                  size={40}
                  color="#94A3B8"
                />
                <Text className="mt-3 text-center text-sm text-slate-500">
                  {pdfError}
                </Text>
              </View>
            )}
          </View>

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
            url={noticeUrl(item.id)}
          />
        </>
      )}
    </View>
  );
}
