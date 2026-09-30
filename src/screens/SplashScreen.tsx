import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";

import Bubble from "@/components/splash/Bubble";
import CornerBrackets from "@/components/splash/CornerBrackets";
import LoadingDots from "@/components/splash/LoadingDots";
import { fetchAppConfig, type AppConfig } from "@/lib/appConfig";

const STAY_AFTER_LOAD_MS = 4500;

type Props = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: Props) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadConfig() {
      try {
        const data = await fetchAppConfig();

        if (mounted) {
          setConfig(data);
        }
      } catch (error) {
        console.log("Unable to load app config. Using defaults.");
      } finally {
        if (mounted) {
          setIsFetched(true);
        }
      }
    }

    loadConfig();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isFetched) return;

    const timer = setTimeout(onFinish, STAY_AFTER_LOAD_MS);

    return () => clearTimeout(timer);
  }, [isFetched, onFinish]);

  const logo = config?.logoUrl
    ? { uri: config.logoUrl }
    : require("../../assets/images/uftb-logo.png");

  const appName = config?.appName ?? "UFTB DIRECTORY";
  const subtitle = config?.subtitle ?? "UNIVERSITY DIRECTORY";

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0B1226", "#1B3A80", "#3B82F6"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating background bubbles */}
      <Bubble size={380} style={{ top: -150, right: -140 }} duration={7000} />

      <Bubble
        size={300}
        style={{ bottom: 150, left: -150 }}
        duration={8000}
        delay={500}
        drift={24}
      />

      <Bubble
        size={190}
        style={{ bottom: 220, right: -80 }}
        duration={6000}
        delay={1000}
      />

      <CornerBrackets />

      {/* Logo */}
      <View style={styles.center}>
        <View style={styles.logoWrap}>
          <Bubble
            size={270}
            style={{ top: 0, left: 0 }}
            duration={4000}
            drift={6}
          />

          {isFetched && (
            <Animated.View entering={ZoomIn.duration(900)}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
            </Animated.View>
          )}
        </View>

        <LoadingDots />
      </View>

      {/* App name appears 1.2 seconds after the logo */}
      {isFetched && (
        <Animated.View
          entering={FadeInDown.delay(1200).duration(900)}
          style={styles.nameWrap}
        >
          <Text style={styles.name}>{appName}</Text>

          <View style={styles.line} />

          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>
      )}

      {/* Version */}
      <Animated.View entering={FadeIn.delay(300)} style={styles.versionWrap}>
        <Text style={styles.version}>
          Version {Constants.expoConfig?.version ?? "1.0.0"}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#0B1226",
    zIndex: 9999,
    elevation: 9999,
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 120,
    gap: 36,
  },

  logoWrap: {
    width: 300,
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },

  logo: {
    width: 190,
    height: 220,
  },

  nameWrap: {
    position: "absolute",
    bottom: 150,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
  },

  name: {
    color: "#EAF2FF",
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 5,
    textAlign: "center",
  },

  line: {
    width: 70,
    height: 2,
    backgroundColor: "#60A5FA",
    marginVertical: 14,
  },

  subtitle: {
    color: "#EAF2FF",
    fontSize: 14,
    letterSpacing: 3,
    textAlign: "center",
  },

  versionWrap: {
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
  },

  version: {
    color: "#EAF2FF",
    letterSpacing: 2,
    fontSize: 12,
  },
});
