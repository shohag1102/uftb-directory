import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TRACK_W = 50;
const TRACK_H = 30;
const THUMB = 24;
const PAD = 3;

export default function Toggle({
  value,
  onValueChange,
  disabled,
}: {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 200 });
  }, [value, progress]);

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      ["#CBD5E1", "#2563EB"],
    ),
  }));

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * (TRACK_W - THUMB - PAD * 2) }],
  }));

  return (
    <Pressable
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      hitSlop={8}
      style={{ opacity: disabled ? 0.45 : 1 }}
    >
      <Animated.View
        style={[
          {
            width: TRACK_W,
            height: TRACK_H,
            borderRadius: TRACK_H / 2,
            padding: PAD,
            justifyContent: "center",
          },
          trackStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              width: THUMB,
              height: THUMB,
              borderRadius: THUMB / 2,
              backgroundColor: "#fff",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 1 },
              elevation: 2,
            },
            thumbStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}
