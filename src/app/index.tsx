import LatestNewsSection from "@/components/LatestNewsSection";
import LatestNoticesSection from "@/components/LatestNoticesSection";
import StatusDot from "@/components/StatusDot";
import { Image } from "expo-image";
import { Link, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

type MenuItem = {
  label: string;
  href: Href;
  image: number; // require() returns a number
  live?: boolean;
};

const MENU: MenuItem[] = [
  {
    label: "Directory",
    href: "/directory",
    image: require("../../assets/images/icons/directory.png"),
    live: true,
  },
  {
    label: "Calendar",
    href: "/calendar",
    image: require("../../assets/images/icons/calendar.png"),
    live: true,
  },
  {
    label: "Transport",
    href: "/transport",
    image: require("../../assets/images/icons/bus-school.png"),
  },
  {
    label: "News",
    href: "/news",
    image: require("../../assets/images/icons/newspaper.png"),
    live: true,
  },
  {
    label: "Notice",
    href: "/notice",
    image: require("../../assets/images/icons/notice.png"),
    live: true,
  },
  {
    label: "Events",
    href: "/events",
    image: require("../../assets/images/icons/event.png"),
  },
];

const card = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.07,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
} as const;

function RealisticIcon({ item }: { item: MenuItem }) {
  return (
    <Image
      source={item.image}
      style={{ width: 38, height: 38 }}
      contentFit="contain"
    />
  );
}

function TileContent({ item }: { item: MenuItem }) {
  return (
    <>
      <RealisticIcon item={item} />
      <Text
        numberOfLines={1}
        className="mt-2 text-[12px] font-bold text-slate-800"
      >
        {item.label}
      </Text>
    </>
  );
}

export default function Home() {
  return (
    <View className="flex-1 bg-slate-100">
      <ScrollView
        contentContainerClassName="px-5 pt-6 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap justify-between">
          {MENU.map((m) => (
            <View key={m.label} className="mb-3 w-[31%]">
              <Link href={m.href} asChild>
                <Pressable
                  className="relative items-center rounded-2xl bg-white p-3"
                  style={card}
                >
                  <TileContent item={m} />
                  <StatusDot live={m.live} />
                </Pressable>
              </Link>
            </View>
          ))}
        </View>
        {/* Latest News / Notices sections go below */}
        <LatestNewsSection />
        <LatestNoticesSection />
      </ScrollView>
    </View>
  );
}
