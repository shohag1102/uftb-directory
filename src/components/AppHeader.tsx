import { Ionicons } from "@expo/vector-icons";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDrawer } from "./DrawerContext";

export default function AppHeader({
  options,
  route,
  back,
  navigation,
}: NativeStackHeaderProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { openDrawer } = useDrawer();
  const isHome = route.name === "index";
  const title = options.title ?? route.name;

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
        {/* Hamburger: on every page */}
        <Pressable
          onPress={openDrawer}
          hitSlop={10}
          className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/20 active:bg-white/30"
        >
          <Ionicons name="menu" size={24} color="#fff" />
        </Pressable>

        {back && options.headerBackVisible !== false && (
          <Pressable onPress={navigation.goBack} hitSlop={12} className="mr-2">
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </Pressable>
        )}

        <Text
          numberOfLines={1}
          className="flex-1 text-2xl font-bold text-white"
        >
          {title}
        </Text>

        {isHome ? (
          <Image
            source={require("../../assets/images/uftb-logo.png")}
            style={{ width: 46, height: 46 }}
            contentFit="contain"
          />
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
