import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter, type Href } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* Footer A: copyright bar */
export function CopyrightFooter() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient
      colors={["#1E6FE8", "#0B3D91"]}
      style={{ paddingTop: 14, paddingBottom: insets.bottom + 10 }}
    >
      <Text className="text-center text-sm font-semibold text-white">
        ICT Service Office, University of Frontier Technology
      </Text>
    </LinearGradient>
  );
}

/* Footer B: floating pill navigation */
const TABS: {
  href: Href;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/directory", label: "Directory", icon: "call" },
  { href: "/news", label: "News", icon: "newspaper" },
  { href: "/notice", label: "Notice", icon: "notifications" },
];

export function TabFooter() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 16,
        right: 16,
        bottom: insets.bottom + 12,
      }}
    >
      <View
        className="flex-row items-center justify-between rounded-full bg-white p-2"
        style={{
          shadowColor: "#0B3D91",
          shadowOpacity: 0.25,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 12,
        }}
      >
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <Pressable
              key={t.label}
              onPress={() => router.navigate(t.href)}
              className={`flex-row items-center rounded-full px-4 py-3 ${
                active ? "bg-blue-600" : ""
              }`}
            >
              <Ionicons
                name={
                  active
                    ? t.icon
                    : (`${t.icon}-outline` as keyof typeof Ionicons.glyphMap)
                }
                size={22}
                color={active ? "#fff" : "#64748B"}
              />
              {active && (
                <Text className="ml-2 font-semibold text-white">{t.label}</Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
