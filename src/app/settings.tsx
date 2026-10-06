import Toggle from "@/components/Toggle";
import {
  useNotificationSettings,
  type CategoryKey,
} from "@/hooks/useNotificationSettings";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const card = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 2,
} as const;

const CATEGORIES: {
  key: CategoryKey;
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  {
    key: "news",
    label: "News",
    desc: "New articles and updates",
    icon: "newspaper",
    color: "#0EA5E9",
  },
  {
    key: "notices",
    label: "Notices",
    desc: "Official university notices",
    icon: "megaphone",
    color: "#7C3AED",
  },
  {
    key: "events",
    label: "Events",
    desc: "Campus events and programs",
    icon: "ribbon",
    color: "#DB2777",
  }
];

export default function NotificationSettings() {
  const {
    permission,
    registering,
    prefs,
    prefsLoaded,
    enable,
    openSystemSettings,
    toggleCategory,
  } = useNotificationSettings();
  const [sendingTest, setSendingTest] = useState(false);

  const granted = permission === "granted";
  const denied = permission === "denied";

  const handleMasterToggle = async (next: boolean) => {
    if (next) {
      await enable();
    } else {
      openSystemSettings();
    }
  };

  // const sendTestNotification = async () => {
  //   setSendingTest(true);
  //   try {
  //     await Notifications.scheduleNotificationAsync({
  //       content: {
  //         title: "UFTB Info",
  //         body: "This is how your notifications will look.",
  //         sound: "default",
  //       },
  //       trigger: null,
  //     });
  //   } finally {
  //     setSendingTest(false);
  //   }
  // };

  return (
    <ScrollView
      className="flex-1 bg-slate-100"
      contentContainerClassName="px-5 pt-6 pb-10"
      showsVerticalScrollIndicator={false}
    >
      {/* Master status card */}
      <LinearGradient
        colors={granted ? ["#0B3D91", "#1E6FE8"] : ["#334155", "#1E293B"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 24, padding: 20, overflow: "hidden" }}
      >
        <View
          style={{
            position: "absolute",
            right: -30,
            top: -30,
            width: 130,
            height: 130,
            borderRadius: 65,
            backgroundColor: "rgba(255,255,255,0.1)",
          }}
        />

        <View className="flex-row items-center">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Ionicons
              name={granted ? "notifications" : "notifications-off"}
              size={26}
              color="#fff"
            />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-white">
              Push Notifications
            </Text>
            <Text className="mt-0.5 text-[12px] text-white/80">
              {permission === "checking"
                ? "Checking status…"
                : granted
                  ? "Enabled on this device"
                  : denied
                    ? "Turned off in system settings"
                    : "Not enabled yet"}
            </Text>
          </View>
          {(registering || permission === "checking") && (
            <ActivityIndicator color="#fff" />
          )}
        </View>
      </LinearGradient>

      {/* Master toggle row */}
      {permission !== "checking" && (
        <View
          className="mt-3 flex-row items-center justify-between rounded-2xl bg-white p-4"
          style={card}
        >
          <View className="flex-1 pr-3">
            <Text className="text-[14px] font-semibold text-slate-800">
              Allow Notifications
            </Text>
            <Text className="mt-0.5 text-[12px] text-slate-500">
              {denied
                ? "Blocked by the system. Tap to open settings and allow."
                : granted
                  ? "Tap to manage in system settings."
                  : "You'll be asked to allow notifications."}
            </Text>
          </View>
          <Toggle
            value={granted}
            onValueChange={handleMasterToggle}
            disabled={registering}
          />
        </View>
      )}

      {denied && (
        <Pressable
          onPress={openSystemSettings}
          className="mt-3 flex-row items-center rounded-2xl bg-amber-50 p-4 active:opacity-80"
        >
          <View className="h-9 w-9 items-center justify-center rounded-full bg-amber-100">
            <Ionicons name="warning" size={18} color="#D97706" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="text-[13px] font-bold text-amber-800">
              Notifications are off
            </Text>
            <Text className="mt-0.5 text-[12px] text-amber-700">
              Open system settings to turn them back on.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#D97706" />
        </Pressable>
      )}

      {/* Category preferences */}
      {/* <View className="mb-3 mt-7 flex-row items-center">
        <View className="mr-2 h-5 w-1.5 rounded-full bg-blue-600" />
        <Text className="text-base font-bold text-slate-800">
          Notify me about
        </Text>
      </View> */}

      {/* <View className="overflow-hidden rounded-2xl bg-white" style={card}>
        {CATEGORIES.map((c, i) => (
          <View key={c.key}>
            <View className="flex-row items-center px-4 py-3.5">
              <View
                className="h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: c.color + "1A" }}
              >
                <Ionicons name={c.icon} size={19} color={c.color} />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-[14px] font-semibold text-slate-800">
                  {c.label}
                </Text>
                <Text className="text-[12px] text-slate-500">{c.desc}</Text>
              </View>
              <Toggle
                value={prefsLoaded ? prefs[c.key] : false}
                onValueChange={() => toggleCategory(c.key)}
                disabled={!granted || !prefsLoaded}
              />
            </View>
            {i < CATEGORIES.length - 1 && (
              <View className="ml-[60px] h-px bg-slate-100" />
            )}
          </View>
        ))}
      </View>
      <Text className="mt-2 px-1 text-[11px] leading-4 text-slate-400">
        These preferences are saved on this device. Turn on Allow Notifications
        above to receive any alerts.
      </Text> */}

      {/* Test notification */}
      {/* <Pressable
        onPress={sendTestNotification}
        disabled={sendingTest || !granted}
        className="mt-7 flex-row items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 py-3.5 active:opacity-80"
        style={{ opacity: !granted ? 0.5 : 1 }}
      >
        {sendingTest ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : (
          <>
            <Ionicons name="paper-plane" size={16} color="#2563EB" />
            <Text className="ml-2 text-[13px] font-bold text-blue-700">
              Preview a Notification
            </Text>
          </>
        )}
      </Pressable>
      <Text className="mt-2 px-1 text-center text-[11px] text-slate-400">
        Shows a sample on this device only — no internet needed.
      </Text> */}
    </ScrollView>
  );
}
