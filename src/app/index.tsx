import { Ionicons } from "@expo/vector-icons";
import { Link, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

const MENU: {
  label: string;
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { label: "Directory", href: "/directory", icon: "call", color: "#16A34A" },
  { label: "Calendar", href: "/calendar", icon: "calendar", color: "#F59E0B" },
  { label: "Transport", href: "/transport", icon: "bus", color: "#DC2626" },
  { label: "News", href: "/news", icon: "newspaper", color: "#2563EB" },
  { label: "Notice", href: "/notice", icon: "megaphone", color: "#7C3AED" },
  { label: "Events", href: "/events", icon: "ribbon", color: "#DB2777" },
];

export default function Home() {
  return (
    <View className="flex-1 bg-slate-100">
      <ScrollView contentContainerClassName="px-5 pt-6 pb-6">
        <View className="flex-row flex-wrap justify-between">
          {MENU.map((m) => (
            <Link key={m.label} href={m.href} asChild>
              <Pressable
                className="mb-4 w-[31%] items-center rounded-2xl bg-white py-4 active:scale-95"
                style={{
                  elevation: 4,
                  shadowColor: "#000",
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                }}
              >
                <View
                  className="mb-2 h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: m.color + "1A" }}
                >
                  <Ionicons name={m.icon} size={28} color={m.color} />
                </View>
                <Text className="text-sm font-semibold text-slate-800">
                  {m.label}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
        {/* Latest News / Notices sections go below */}
      </ScrollView>
    </View>
  );
}
