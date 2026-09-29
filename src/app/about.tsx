import { useContactModal } from "@/hooks/useContactModal";
import type { Person } from "@/types/person";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const DEVELOPER: Person = {
  id: "EMP001",
  name: "Md. Saikat Hossain Shohag",
  category: "OFFICER",
  designation: "Assistant Computer Programmer",
  organizationUnitId: "OFF006",
  office: "ICT Services Office",
  university: "University of Frontier Technology",
  image: require("../../assets/images/shohag-suit.png"),
  mobile: "+8801785371470",
  email: "saikathossain1102@gmail.com",
  bloodGroup: "O+",
};

type Feature = {
  label: string;
  desc: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const CURRENT: Feature[] = [
  {
    label: "Directory",
    desc: "Contact details of teachers, officers and staff across faculties, offices, institutes, halls and laboratories.",
    icon: "call",
    color: "#16A34A",
  },
];

const UPCOMING: Feature[] = [
  {
    label: "Calendar",
    desc: "Academic dates",
    icon: "calendar",
    color: "#F59E0B",
  },
  { label: "Transport", desc: "Bus schedules", icon: "bus", color: "#EA580C" },
  {
    label: "News",
    desc: "Latest updates",
    icon: "newspaper",
    color: "#0EA5E9",
  },
  {
    label: "Notice",
    desc: "Official notices",
    icon: "megaphone",
    color: "#7C3AED",
  },
  { label: "Events", desc: "Campus events", icon: "ribbon", color: "#DB2777" },
  {
    label: "Videos",
    desc: "Watch & learn",
    icon: "videocam",
    color: "#DC2626",
  },
];

const card = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.07,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
} as const;

function SectionTitle({ title }: { title: string }) {
  return (
    <View className="mb-3 mt-7 flex-row items-center">
      <View className="mr-2 h-5 w-1.5 rounded-full bg-blue-600" />
      <Text className="text-lg font-bold text-slate-800">{title}</Text>
    </View>
  );
}

export default function About() {
  const { openContact } = useContactModal();

  return (
    <ScrollView
      className="flex-1 bg-slate-100"
      contentContainerClassName="px-5 pt-6 pb-10"
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <Animated.View entering={FadeInDown.duration(500)}>
        <LinearGradient
          colors={["#0B3D91", "#1E6FE8"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 28, padding: 20, overflow: "hidden" }}
        >
          <View
            style={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 160,
              height: 160,
              borderRadius: 80,
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          />
          <View
            style={{
              position: "absolute",
              right: 60,
              bottom: -60,
              width: 110,
              height: 110,
              borderRadius: 55,
              backgroundColor: "rgba(255,255,255,0.08)",
            }}
          />

          <View className="flex-row items-center">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white">
              <Image
                source={require("../../assets/images/uftb-logo.png")}
                style={{ width: 44, height: 44 }}
                contentFit="contain"
              />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-2xl font-bold text-white">UFTB Info</Text>
              <View className="mt-1 self-start rounded-full bg-white/20 px-3 py-0.5">
                <Text className="text-xs font-semibold text-white">
                  Version {Constants.expoConfig?.version ?? "1.0.0"}
                </Text>
              </View>
            </View>
          </View>

          <Text className="mt-4 text-[14px] leading-6 text-white/90">
            UFTB Info brings campus contacts and services to your phone. Find
            the right person or office in seconds, and stay tuned as more
            features arrive.
          </Text>
        </LinearGradient>
      </Animated.View>

      {/* Current */}
      <SectionTitle title="Available Now" />
      {CURRENT.map((f) => (
        <Animated.View
          key={f.label}
          entering={FadeInDown.delay(120).duration(500)}
          className="flex-row rounded-2xl bg-white p-4"
          style={[card, { borderLeftWidth: 4, borderLeftColor: f.color }]}
        >
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: f.color + "1F" }}
          >
            <Ionicons name={f.icon} size={24} color={f.color} />
          </View>
          <View className="ml-3 flex-1">
            <View className="flex-row items-center">
              <Text className="text-base font-bold text-slate-800">
                {f.label}
              </Text>
              <View className="ml-2 flex-row items-center rounded-full bg-green-100 px-2 py-0.5">
                <View className="mr-1 h-1.5 w-1.5 rounded-full bg-green-600" />
                <Text className="text-[10px] font-bold text-green-700">
                  LIVE
                </Text>
              </View>
            </View>
            <Text className="mt-1 text-[13px] leading-5 text-slate-500">
              {f.desc}
            </Text>
          </View>
        </Animated.View>
      ))}

      {/* Upcoming */}
      <SectionTitle title="Coming Soon" />
      <View className="flex-row flex-wrap justify-between">
        {UPCOMING.map((f, i) => (
          <Animated.View
            key={f.label}
            entering={FadeInDown.delay(200 + i * 70).duration(450)}
            className="mb-3 w-[48%] rounded-2xl bg-white p-4"
            style={card}
          >
            <View className="flex-row items-start justify-between">
              <View
                className="h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: f.color + "1F" }}
              >
                <Ionicons name={f.icon} size={22} color={f.color} />
              </View>
              <View className="rounded-full bg-amber-100 px-2 py-0.5">
                <Text className="text-[10px] font-bold text-amber-700">
                  SOON
                </Text>
              </View>
            </View>
            <Text className="mt-3 text-[15px] font-bold text-slate-800">
              {f.label}
            </Text>
            <Text className="mt-0.5 text-xs text-slate-500">{f.desc}</Text>
          </Animated.View>
        ))}
      </View>

      {/* Contact developer */}
      <Animated.View
        entering={FadeInDown.delay(700).duration(500)}
        className="mt-4 items-center rounded-3xl bg-white p-5"
        style={card}
      >
        <View className="h-14 w-14 items-center justify-center rounded-full bg-blue-100">
          <Ionicons name="chatbubbles" size={26} color="#2563EB" />
        </View>
        <Text className="mt-3 text-base font-bold text-slate-800">
          Have feedback or found a bug?
        </Text>
        <Text className="mt-1 text-center text-[13px] leading-5 text-slate-500">
          Reach out to the developer directly by call, message, WhatsApp or
          email.
        </Text>

        <Pressable
          onPress={() => openContact(DEVELOPER)}
          className="mt-4 active:scale-95 active:opacity-90"
        >
          <LinearGradient
            colors={["#0B3D91", "#1E6FE8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 13,
              paddingHorizontal: 28,
              borderRadius: 999,
            }}
          >
            <Ionicons name="person-circle" size={20} color="#fff" />
            <Text className="ml-2 text-[15px] font-bold text-white">
              Contact Developer
            </Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}
