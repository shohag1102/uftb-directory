import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const LIVE_COLOR = "#16A34A";
const PENDING_COLOR = "#EA580C";

export default function StatusDot({ live }: { live?: boolean }) {
  const color = live ? LIVE_COLOR : PENDING_COLOR;
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1100, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 1100, easing: Easing.in(Easing.quad) }),
      ),
      -1,
    );
    return () => cancelAnimation(pulse);
  }, [pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.5 - pulse.value * 0.4,
    transform: [{ scale: 1 + pulse.value * 1.4 }],
  }));

  return (
    <View
      style={{
        position: "absolute",
        top: 6,
        right: 6,
        width: 14,
        height: 14,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: color,
          },
          glowStyle,
        ]}
      />
      <View
        style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }}
      />
    </View>
  );
}
