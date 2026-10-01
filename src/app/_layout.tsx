import AppHeader from "@/components/AppHeader";
import { DrawerProvider } from "@/components/DrawerContext";
import { CopyrightFooter } from "@/components/Footers";
import Sidebar from "@/components/Sidebar";
import { ContactModalProvider } from "@/hooks/useContactModal";
import { Stack } from "expo-router";
import * as NativeSplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "../global.css";

import CustomSplashScreen from "@/screens/SplashScreen";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const onLayoutRootView = useCallback(async () => {
    await NativeSplashScreen.hideAsync();
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);
  return (
    <View className="flex-1" onLayout={onLayoutRootView}>
      <DrawerProvider>
        <ContactModalProvider>
          <View className="flex-1">
            <StatusBar style="light" />

            <View className="flex-1">
              <Stack
                screenOptions={{ header: (props) => <AppHeader {...props} /> }}
              >
                <Stack.Screen
                  name="index"
                  options={{ title: "UFTB Info", isHomeScreen: true } as any}
                />
                <Stack.Screen
                  name="directory"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="about" options={{ title: "About" }} />
                <Stack.Screen name="news" options={{ headerShown: false }} />
              </Stack>
              <CopyrightFooter />
            </View>

            {/* Must be last so it draws over the header and footer */}
            <Sidebar />
          </View>
        </ContactModalProvider>
      </DrawerProvider>
      {/* Custom splash overlay */}
      {showSplash && <CustomSplashScreen onFinish={handleSplashFinish} />}
    </View>
  );
}
