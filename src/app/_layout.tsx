import AppHeader from "@/components/AppHeader";
import { DrawerProvider } from "@/components/DrawerContext";
import { CopyrightFooter } from "@/components/Footers";
import Sidebar from "@/components/Sidebar";
import { ContactModalProvider } from "@/hooks/useContactModal";
import {
  listenForPushTokenChanges,
  registerForPushNotifications,
} from "@/services/notifications";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import * as NativeSplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { BackHandler, View } from "react-native";
import "../global.css";

import CustomSplashScreen from "@/screens/SplashScreen";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";

SplashScreen.preventAutoHideAsync();

type PendingTarget = { href: string; cold: boolean };

export default function RootLayout() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [pending, setPending] = useState<PendingTarget | null>(null);
  const backNavigatingRef = useRef(false);

  // The hook and the listener can both report the same tap, so remember handled ids
  const handledRef = useRef<Set<string>>(new Set());
  const showSplashRef = useRef(true);
  showSplashRef.current = showSplash;

  const onLayoutRootView = useCallback(async () => {
    await NativeSplashScreen.hideAsync();
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  // Read the notification payload and decide where to go
  const queueFromNotification = useCallback(
    (response: Notifications.NotificationResponse | null | undefined) => {
      if (!response) return;

      const id = response.notification.request.identifier;
      if (handledRef.current.has(id)) return;
      handledRef.current.add(id);

      const data = response.notification.request.content.data as
        { type?: string; id?: string } | undefined;
      if (!data?.id) return;

      let href: string | null = null;
      if (data.type === "news") href = `/news/${data.id}`;
      if (data.type === "notice") href = `/notice/${data.id}`;
      if (!href) return;

      // If the splash is still showing, the app was opened by the tap (cold start)
      setPending({ href, cold: showSplashRef.current });
    },
    [],
  );

  // App was killed and opened by tapping a notification
  const lastResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    queueFromNotification(lastResponse);
  }, [lastResponse, queueFromNotification]);

  // App is running (foreground or background) and user taps a notification
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      queueFromNotification,
    );
    return () => sub.remove();
  }, [queueFromNotification]);

  // Navigate once the splash is gone and the navigator is ready
  useEffect(() => {
    if (!pending || showSplash) return;

    if (pending.cold) router.replace("/"); // so Back goes to Home
    router.push(pending.href as any);
    setPending(null);
  }, [pending, showSplash, router]);

  useEffect(() => {
    registerForPushNotifications().catch((error) => {
      console.error("Push registration failed:", error);
    });

    const subscription = listenForPushTokenChanges();
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (backNavigatingRef.current) return true; // swallow the extra rapid press

      backNavigatingRef.current = true;
      setTimeout(() => {
        backNavigatingRef.current = false;
      }, 400);

      return false; // let the default back behavior proceed normally
    });

    return () => sub.remove();
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
                <Stack.Screen name="notice" options={{ headerShown: false }} />
                <Stack.Screen
                  name="settings"
                  options={{ title: "Notification Settings" }}
                />
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
