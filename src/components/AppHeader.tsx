import { Ionicons } from "@expo/vector-icons";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDrawer } from "./DrawerContext";

const TOP_LEVEL = [
  "index",
  "calendar",
  "news",
  "notice",
  "events",
  "videos",
  "transport",
  "about",
];

type ExtraHeaderOptions = {
  hideMenuButton?: boolean;
  rightHref?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  isHomeScreen?: boolean;
  subtitle?: string;
};

export default function AppHeader({
  options,
  route,
  back,
  navigation,
}: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const title = options.title ?? route.name;
  const extra = options as typeof options & ExtraHeaderOptions;
  const isHome = !!extra.isHomeScreen;

  const showBack =
    back &&
    options.headerBackVisible !== false &&
    !TOP_LEVEL.includes(route.name);
  const showMenu = !extra.hideMenuButton;

  return (
    <LinearGradient
      colors={["#0B3D91", "#1E6FE8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingTop: insets.top + 12,
        paddingBottom: 22,
        paddingHorizontal: 16,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
      }}
    >
      <View className="flex-row items-center">
        {showMenu && (
          <Pressable
            onPress={openDrawer}
            hitSlop={10}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/20 active:bg-white/30"
          >
            <Ionicons name="menu" size={24} color="#fff" />
          </Pressable>
        )}

        {showBack && (
          <Pressable onPress={navigation.goBack} hitSlop={12} className="mr-2">
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
        )}

        <View className="flex-1">
          <Text numberOfLines={1} className="text-2xl font-bold text-white">
            {title}
          </Text>
          {!!extra.subtitle && (
            <Text
              numberOfLines={1}
              className="-mt-0.5 text-[12px] font-medium text-blue-100"
            >
              {extra.subtitle}
            </Text>
          )}
        </View>

        {isHome ? (
          <Image
            source={require("../../assets/images/uftb-logo.png")}
            style={{ width: 60, height: 60, }}
            contentFit="contain"
          />
        ) : extra.rightHref ? (
          <Pressable
            onPress={() => router.dismissTo(extra.rightHref as any)}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/20 active:bg-white/30"
          >
            <Ionicons
              name={extra.rightIcon ?? "grid-outline"}
              size={20}
              color="#fff"
            />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.dismissTo("/")}
            hitSlop={10}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/20 active:bg-white/30"
          >
            <Ionicons name="home" size={22} color="#fff" />
          </Pressable>
        )}
      </View>
    </LinearGradient>
  );
}
