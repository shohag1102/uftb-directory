import { StyleSheet, View } from "react-native";

const SIZE = 22;
const WIDTH = 1.5;
const COLOR = "rgba(255,255,255,0.7)";

const base = {
  position: "absolute" as const,
  width: SIZE,
  height: SIZE,
  borderColor: COLOR,
};

export default function CornerBrackets() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View
        style={[
          base,
          {
            top: 60,
            left: 24,
            borderTopWidth: WIDTH,
            borderLeftWidth: WIDTH,
          },
        ]}
      />

      <View
        style={[
          base,
          {
            top: 60,
            right: 24,
            borderTopWidth: WIDTH,
            borderRightWidth: WIDTH,
          },
        ]}
      />

      <View
        style={[
          base,
          {
            bottom: 40,
            left: 24,
            borderBottomWidth: WIDTH,
            borderLeftWidth: WIDTH,
          },
        ]}
      />

      <View
        style={[
          base,
          {
            bottom: 40,
            right: 24,
            borderBottomWidth: WIDTH,
            borderRightWidth: WIDTH,
          },
        ]}
      />
    </View>
  );
}
