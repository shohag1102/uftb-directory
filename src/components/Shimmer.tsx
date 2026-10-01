import { useEffect } from "react";
import { type ViewStyle } from "react-native";
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export function ShimmerBlock({ style }: { style?: ViewStyle }) {
  const v = useSharedValue(0.4);

  useEffect(() => {
    v.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withTiming(0.4, { duration: 700 }),
      ),
      -1,
    );
    return () => cancelAnimation(v);
  }, [v]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: v.value }));

  return (
    <Animated.View
      style={[
        { backgroundColor: "#E2E8F0", borderRadius: 8 },
        style,
        animatedStyle,
      ]}
    />
  );
}
