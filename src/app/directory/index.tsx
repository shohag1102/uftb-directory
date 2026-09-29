import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, Stack, type Href } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

type Item = {
  title: string;
  subtitle: string;
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  colors: [string, string];
};

const ITEMS: Item[] = [
  {
    title: "Faculties",
    subtitle: "Faculties & departments",
    href: "/directory/faculties",
    icon: "school",
    colors: ["#E11D48", "#FB7185"],
  },
  {
    title: "Offices",
    subtitle: "Administrative offices",
    href: "/directory/offices",
    icon: "business",
    colors: ["#2563EB", "#60A5FA"],
  },
  {
    title: "Institutes",
    subtitle: "Institutes & sections",
    href: "/directory/institutes",
    icon: "book",
    colors: ["#16A34A", "#4ADE80"],
  },
  {
    title: "Halls",
    subtitle: "Residential halls",
    href: "/directory/halls",
    icon: "home",
    colors: ["#EA580C", "#FB923C"],
  },
  {
    title: "Laboratories",
    subtitle: "Labs & research centers",
    href: "/directory/laboratories",
    icon: "flask",
    colors: ["#7C3AED", "#C084FC"],
  },
];

function DirectoryCard({ item, wide }: { item: Item; wide?: boolean }) {
  return (
    <Link href={item.href} asChild>
      <Pressable
        className={`mb-4 active:scale-[0.97] active:opacity-90 ${wide ? "w-full" : "w-[48%]"}`}
        style={{
          borderRadius: 24,
          backgroundColor: item.colors[0],
          shadowColor: item.colors[0],
          shadowOpacity: 0.35,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={item.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 24,
            padding: 16,
            minHeight: wide ? 120 : 160,
            justifyContent: "space-between",
            overflow: "hidden",
          }}
        >
          {/* decorative circles */}
          <View
            style={{
              position: "absolute",
              right: -28,
              top: -28,
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: "rgba(255,255,255,0.16)",
            }}
          />
          <View
            style={{
              position: "absolute",
              right: 30,
              bottom: -40,
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "rgba(255,255,255,0.10)",
            }}
          />

          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white/25">
            <Ionicons name={item.icon} size={26} color="#fff" />
          </View>

          <View className="flex-row items-end justify-between">
            <View className="flex-1 pr-2">
              <Text className="text-lg font-bold text-white">{item.title}</Text>
              <Text className="mt-0.5 text-xs text-white/85" numberOfLines={2}>
                {item.subtitle}
              </Text>
            </View>
            <View className="h-8 w-8 items-center justify-center rounded-full bg-white">
              <Ionicons name="arrow-forward" size={16} color={item.colors[0]} />
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Link>
  );
}

export default function Directory() {
  const last = ITEMS.length - 1;

  return (
    <View className="flex-1 bg-slate-100">
      <Stack.Screen options={{ title: 'Directory' }} />
      <ScrollView
        contentContainerClassName="px-5 pt-6 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xl font-bold text-slate-800">
          Browse Directory
        </Text>
        <Text className="mb-5 mt-1 text-sm text-slate-500">
          Choose a category to find contact details.
        </Text>

        <View className="flex-row flex-wrap justify-between">
          {ITEMS.map((item, i) => (
            // 2 cards per row, and the odd last card spans the full width
            <DirectoryCard
              key={item.title}
              item={item}
              wide={i === last && ITEMS.length % 2 === 1}
            />
          ))}
        </View>

        {/* Bottom note */}
        <View
          className="mt-1 flex-row rounded-2xl bg-blue-50 p-4"
          style={{ borderLeftWidth: 4, borderLeftColor: "#2563EB" }}
        >
          <View className="mr-3 h-9 w-9 items-center justify-center rounded-full bg-blue-600">
            <Ionicons name="information" size={20} color="#fff" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-blue-900">
              Good to know
            </Text>
            <Text className="mt-1 text-[13px] leading-5 text-slate-600">
              All information is provided and maintained by the respective
              faculties, offices, institutes, halls and laboratories.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
