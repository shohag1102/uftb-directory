import { useEffect } from "react";
import { ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  size: number;
  style?: ViewStyle;
  duration?: number;
  delay?: number;
  drift?: number;
};

export default function Bubble({
  size,
  style,
  duration = 6000,
  delay = 0,
  drift = 18,
}: Props) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );
  }, [delay, duration, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: (progress.value - 0.5) * drift * 2 },
      { translateX: (0.5 - progress.value) * drift },
      { scale: 1 + progress.value * 0.06 },
    ],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: "rgba(255,255,255,0.08)",
        },
        style,
        animatedStyle,
      ]}
    />
  );
}
