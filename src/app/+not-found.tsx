import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

/* Three bouncing dots: "working on it..." */
function Dot({ delay }: { delay: number }) {
  const v = useSharedValue(0.3);

  useEffect(() => {
    v.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(v);
  }, [delay, v]);

  const style = useAnimatedStyle(() => ({
    opacity: v.value,
    transform: [{ scale: 0.7 + v.value * 0.5 }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: "#2563EB",
          marginHorizontal: 4,
        },
        style,
      ]}
    />
  );
}

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  // "/calendar" -> "Calendar", "/settings/my-alerts" -> "My Alerts"
  const title = decodeURIComponent(
    pathname.split("/").filter(Boolean).pop() ?? "Page",
  )
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const big = useSharedValue(0);
  const small = useSharedValue(0);
  const float = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    big.value = withRepeat(
      withTiming(360, { duration: 8000, easing: Easing.linear }),
      -1,
      false,
    );
    small.value = withRepeat(
      withTiming(-360, { duration: 5000, easing: Easing.linear }),
      -1,
      false,
    );
    float.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
    );
    pulse.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) }),
      -1,
      false,
    );

    return () => {
      cancelAnimation(big);
      cancelAnimation(small);
      cancelAnimation(float);
      cancelAnimation(pulse);
    };
  }, [big, small, float, pulse]);

  const bigStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${big.value}deg` }],
  }));
  const smallStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${small.value}deg` }],
  }));
  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value }],
  }));
  const ringStyle = useAnimatedStyle(() => ({
    opacity: 0.45 * (1 - pulse.value),
    transform: [{ scale: 1 + pulse.value * 0.7 }],
  }));

  return (
    <View className="flex-1 items-center justify-center bg-slate-100 px-8">
      <Stack.Screen options={{ title: title, headerBackVisible: false }} />

      {/* Animated stage */}
      <Animated.View style={[{ width: 220, height: 220 }, floatStyle]}>
        <View className="flex-1 items-center justify-center">
          {/* pulsing ring */}
          <Animated.View
            style={[
              {
                position: "absolute",
                width: 150,
                height: 150,
                borderRadius: 75,
                backgroundColor: "#93C5FD",
              },
              ringStyle,
            ]}
          />

          {/* main disc + big gear */}
          <View
            className="h-36 w-36 items-center justify-center rounded-full bg-white"
            style={{
              shadowColor: "#1E6FE8",
              shadowOpacity: 0.3,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 8 },
              elevation: 10,
            }}
          >
            <Animated.View style={bigStyle}>
              <Ionicons name="settings" size={92} color="#2563EB" />
            </Animated.View>
          </View>

          {/* small gear, spins the opposite way */}
          <Animated.View
            style={[{ position: "absolute", right: 8, bottom: 14 }, smallStyle]}
          >
            <Ionicons name="settings" size={54} color="#F59E0B" />
          </Animated.View>

          {/* tool badge */}
          <View
            className="absolute left-3 top-6 h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: "#16A34A",
              transform: [{ rotate: "-12deg" }],
              shadowColor: "#16A34A",
              shadowOpacity: 0.4,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <Ionicons name="construct" size={26} color="#fff" />
          </View>
        </View>
      </Animated.View>

      {/* Text */}
      <Animated.View
        entering={FadeInDown.delay(150).duration(500)}
        className="mt-8 items-center"
      >
        <Text className="text-2xl font-bold text-slate-800">
          Under Maintenance
        </Text>
        <Text className="mt-2 text-center text-[15px] leading-6 text-slate-500">
          We're working on this page.{"\n"}Please check back soon.
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(300).duration(500)}
        className="mt-6 flex-row"
      >
        <Dot delay={0} />
        <Dot delay={200} />
        <Dot delay={400} />
      </Animated.View>

      {/* Home button */}
      <Animated.View
        entering={FadeInDown.delay(450).duration(500)}
        className="mt-8"
      >
        <Pressable
          onPress={() => router.replace("/")}
          className="active:scale-95 active:opacity-90"
        >
          <LinearGradient
            colors={["#0B3D91", "#1E6FE8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 999,
            }}
          >
            <Ionicons name="home" size={18} color="#fff" />
            <Text className="ml-2 font-semibold text-white">Go to Home</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}
