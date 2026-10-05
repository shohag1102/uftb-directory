import { registerPushToken } from "@/api/notificationApi";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device.");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#3B82F6",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Push notification permission was not granted.");
    return null;
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    throw new Error("Expo projectId is missing.");
  }

  const { data: token } = await Notifications.getExpoPushTokenAsync({
    projectId,
  });
  console.log("Expo push token:", token);

  await registerPushToken({
    token,
    platform: Platform.OS === "ios" ? "ios" : "android",
  });
  return token;
}

let isRefreshing = false;

export function listenForPushTokenChanges() {
  return Notifications.addPushTokenListener(async () => {
    if (isRefreshing) return;
    isRefreshing = true;

    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.warn("Expo projectId missing — cannot refresh push token.");
        return;
      }

      const { data: expoToken } = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      console.log("Expo push token refreshed:", expoToken);

      await registerPushToken({
        token: expoToken,
        platform: Platform.OS === "ios" ? "ios" : "android",
      });
    } catch (error) {
      console.error("Failed to refresh/register push token:", error);
    } finally {
      isRefreshing = false;
    }
  });
}
