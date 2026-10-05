import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter, type Href } from "expo-router";
import { useEffect } from "react";
import {
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDrawer } from "./DrawerContext";

type MenuItem = {
  label: string;
  href: Href;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const MAIN: MenuItem[] = [
  { label: "Home", href: "/", icon: "home", color: "#2563EB" },
  { label: "Directory", href: "/directory", icon: "call", color: "#16A34A" },
  { label: "Calendar", href: "/calendar", icon: "calendar", color: "#F59E0B" },
  { label: "News", href: "/news", icon: "newspaper", color: "#0EA5E9" },
  { label: "Notice", href: "/notice", icon: "megaphone", color: "#7C3AED" },
  { label: "Events", href: "/events", icon: "ribbon", color: "#DB2777" },
  { label: "Transport", href: "/transport", icon: "bus", color: "#EA580C" },
];

const MORE: MenuItem[] = [
  {
    label: "Notification Settings",
    href: "/settings",
    icon: "notifications",
    color: "#64748B",
  },
  {
    label: "About",
    href: "/about",
    icon: "information-circle",
    color: "#64748B",
  },
];

function Row({
  item,
  active,
  onPress,
}: {
  item: MenuItem;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`mb-1 flex-row items-center rounded-2xl px-3 py-2.5 active:opacity-70 ${
        active ? "bg-blue-50" : ""
      }`}
    >
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: active ? item.color : item.color + "1A" }}
      >
        <Ionicons
          name={item.icon}
          size={20}
          color={active ? "#fff" : item.color}
        />
      </View>
      <Text
        className={`ml-3 flex-1 text-[15px] ${
          active ? "font-bold text-blue-800" : "font-medium text-slate-700"
        }`}
      >
        {item.label}
      </Text>
      {active && <View className="h-2 w-2 rounded-full bg-blue-600" />}
    </Pressable>
  );
}

export default function Sidebar() {
  const { isOpen, closeDrawer } = useDrawer();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const panelWidth = Math.min(320, width * 0.82);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(isOpen ? 1 : 0, {
      duration: 260,
      easing: Easing.out(Easing.cubic),
    });
  }, [isOpen, progress]);

  // Android back button closes the drawer first
  useEffect(() => {
    if (!isOpen) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      closeDrawer();
      return true;
    });
    return () => sub.remove();
  }, [isOpen, closeDrawer]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: (progress.value - 1) * panelWidth }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  const isActive = (href: Href) =>
    typeof href === "string" &&
    (href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/"));

  // const go = (href: Href) => {
  //   closeDrawer();
  //   if (isActive(href)) return; // already on this page

  //   // Clear the history, then make the chosen page the new root
  //   if (router.canDismiss()) router.dismissAll();
  //   router.replace(href);
  // };
  const go = (href: Href) => {
    closeDrawer();

    if (isActive(href)) return;

    router.navigate(href);
  };

  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { pointerEvents: isOpen ? "auto" : "none" },
      ]}
    >
      {/* Dimmed backdrop */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: "rgba(15,23,42,0.55)" },
          backdropStyle,
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
      </Animated.View>

      {/* Panel */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: panelWidth,
            backgroundColor: "#fff",
            borderTopRightRadius: 28,
            borderBottomRightRadius: 28,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 24,
          },
          panelStyle,
        ]}
      >
        {/* Brand header */}
        <LinearGradient
          colors={["#0B3D91", "#1E6FE8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingTop: insets.top + 24,
            paddingBottom: 26,
            paddingHorizontal: 20,
            borderBottomRightRadius: 44,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              position: "absolute",
              right: -30,
              top: -20,
              width: 130,
              height: 130,
              borderRadius: 65,
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          />
          <View
            style={{
              position: "absolute",
              right: 40,
              bottom: -50,
              width: 90,
              height: 90,
              borderRadius: 45,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />

          <View
            className="h-20 w-20 items-center justify-center rounded-full"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.25,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <Image
              source={require("../../assets/images/uftb-logo.png")}
              style={{ width: 100, height: 100 }}
              contentFit="contain"
            />
          </View>
          <Text className="mt-4 text-2xl font-bold text-white">UFTB Info</Text>
          <Text className="mt-0.5 text-sm text-white/80">
            Directory & Information
          </Text>
        </LinearGradient>

        {/* Menu */}
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-3 pt-4 pb-2"
          showsVerticalScrollIndicator={false}
        >
          {MAIN.map((item) => (
            <Row
              key={item.label}
              item={item}
              active={isActive(item.href)}
              onPress={() => go(item.href)}
            />
          ))}

          <View className="mx-3 mb-2 mt-3 flex-row items-center">
            <Text className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              More
            </Text>
            <View className="ml-3 h-px flex-1 bg-slate-200" />
          </View>

          {MORE.map((item) => (
            <Row
              key={item.label}
              item={item}
              active={isActive(item.href)}
              onPress={() => go(item.href)}
            />
          ))}
        </ScrollView>

        {/* Version */}
        <View
          className="items-center border-t border-slate-200 bg-slate-50 pt-3"
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          <Text className="text-xs font-medium text-slate-500">
            Version {Constants.expoConfig?.version ?? "1.0.0"}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
