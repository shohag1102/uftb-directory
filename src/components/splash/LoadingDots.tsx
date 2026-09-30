import { useEffect, useState } from "react";
import { View } from "react-native";

export default function LoadingDots() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % 3);
    }, 700);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      {[0, 1, 2].map((index) => (
        <View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor:
              index === active ? "#BFDBFE" : "rgba(255,255,255,0.3)",
          }}
        />
      ))}
    </View>
  );
}
