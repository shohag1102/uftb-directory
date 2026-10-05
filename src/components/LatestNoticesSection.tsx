import { NoticeCard, NoticeCardSkeleton } from "@/components/NoticeCard";
import { useMinDelay } from "@/hooks/useMinDelay";
import { useLatestNotices } from "@/hooks/useNotices";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function LatestNoticesSection() {
  const { notices, loading: rawLoading, error } = useLatestNotices(5);
  const loading = useMinDelay(rawLoading, 700);

  return (
    <View className="mt-7">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-bold text-slate-800">Latest Notices</Text>
        <Link href="/notice" asChild>
          <Pressable className="rounded-full bg-blue-600 px-3.5 py-1.5 active:opacity-80">
            <Text className="text-xs font-bold text-white">View All</Text>
          </Pressable>
        </Link>
      </View>

      {loading ? (
        <>
          {[1, 2, 3].map((i) => (
            <NoticeCardSkeleton key={i} />
          ))}
        </>
      ) : error ? (
        <Text className="text-sm text-slate-400">{error}</Text>
      ) : (
        notices.map((item) => <NoticeCard key={item.id} item={item} />)
      )}
    </View>
  );
}
