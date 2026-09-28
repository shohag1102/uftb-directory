import { Image } from "expo-image";
import { Link, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

type MenuItem = {
  label: string;
  desc: string;
  href: Href;
  image: number; // require() returns a number
  live?: boolean;
};

const MENU: MenuItem[] = [
  {
    label: "Directory",
    desc: "Teachers, officers & staff",
    href: "/directory",
    image: require("../../assets/images/icons/directory.png"),
    live: true,
  },
  {
    label: "Calendar",
    desc: "Academic dates",
    href: "/calendar",
    image: require("../../assets/images/icons/calendar.png"),
  },
  {
    label: "Transport",
    desc: "Bus schedules",
    href: "/transport",
    image: require("../../assets/images/icons/bus-school.png"),
  },
  {
    label: "News",
    desc: "Latest updates",
    href: "/news",
    image: require("../../assets/images/icons/newspaper.png"),
  },
  {
    label: "Notice",
    desc: "Official notices",
    href: "/notice",
    image: require("../../assets/images/icons/notice.png"),
  },
  {
    label: "Events",
    desc: "Campus events",
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
      style={{ width: 52, height: 52 }}
      contentFit="contain"
    />
  );
}

function Badge({ live }: { live?: boolean }) {
  return live ? (
    <View className="flex-row items-center rounded-full bg-green-100 px-2 py-0.5">
      <View className="mr-1 h-1.5 w-1.5 rounded-full bg-green-600" />
      <Text className="text-[10px] font-bold text-green-700">LIVE</Text>
    </View>
  ) : (
    <View className="rounded-full bg-amber-100 px-2 py-0.5">
      <Text className="text-[10px] font-bold text-amber-700">SOON</Text>
    </View>
  );
}

function TileContent({ item }: { item: MenuItem }) {
  return (
    <>
      <View className="flex-row items-start justify-between">
        <RealisticIcon item={item} />
        <Badge live={item.live} />
      </View>
      <Text className="mt-3 text-[15px] font-bold text-slate-800">
        {item.label}
      </Text>
      <Text className="mt-0.5 text-xs text-slate-500">{item.desc}</Text>
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
          {MENU.map((m, i) => (
            <Animated.View
              key={m.label}
              entering={FadeInDown.delay(i * 70).duration(450)}
              className="mb-3 w-[48%]"
            >
              {m.live ? (
                <Link href={m.href} asChild>
                  <Pressable
                    className="rounded-2xl bg-white p-4 active:scale-95 active:opacity-90"
                    style={card}
                  >
                    <TileContent item={m} />
                  </Pressable>
                </Link>
              ) : (
                <View className="rounded-2xl bg-white p-4" style={card}>
                  <TileContent item={m} />
                </View>
              )}
            </Animated.View>
          ))}
        </View>
        {/* Latest News / Notices sections go below */}
      </ScrollView>
    </View>
  );
}
