import { registerForPushNotifications } from "@/services/notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { Linking } from "react-native";

const CATEGORY_KEY = "notification_categories_v1";

export type CategoryKey = "news" | "notices" | "events" | "transport";

export type CategoryPrefs = Record<CategoryKey, boolean>;

const DEFAULT_PREFS: CategoryPrefs = {
  news: true,
  notices: true,
  events: true,
  transport: true,
};

export type PermissionState =
  "checking" | "granted" | "denied" | "undetermined";

export function useNotificationSettings() {
  const [permission, setPermission] = useState<PermissionState>("checking");
  const [registering, setRegistering] = useState(false);
  const [prefs, setPrefs] = useState<CategoryPrefs>(DEFAULT_PREFS);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  const checkPermission = useCallback(async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermission(status as PermissionState);
  }, []);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    AsyncStorage.getItem(CATEGORY_KEY)
      .then((raw) => {
        if (raw) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) });
      })
      .finally(() => setPrefsLoaded(true));
  }, []);

  const enable = useCallback(async () => {
    setRegistering(true);
    try {
      await registerForPushNotifications();
    } finally {
      setRegistering(false);
      await checkPermission();
    }
  }, [checkPermission]);

  const openSystemSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const toggleCategory = useCallback((key: CategoryKey) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      AsyncStorage.setItem(CATEGORY_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    permission,
    registering,
    prefs,
    prefsLoaded,
    enable,
    openSystemSettings,
    refreshPermission: checkPermission,
    toggleCategory,
  };
}
