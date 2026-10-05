import { callNumber, openWhatsApp, sendEmail, sendSms } from "@/lib/contact";
import type { Person } from "@/types/person";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { Easing, Keyframe } from "react-native-reanimated";

type Props = { person: Person | null; visible: boolean; onClose: () => void };
type IconName = keyof typeof Ionicons.glyphMap;

const enter = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.94 }, { translateY: 16 }] },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }, { translateY: 0 }],
    easing: Easing.out(Easing.cubic),
  },
}).duration(260);

const shadow = {
  shadowColor: "#0B3D91",
  shadowOpacity: 0.25,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 8 },
  elevation: 12,
} as const;

function Avatar({
  name,
  image,
  size = 76,
}: {
  name: string;
  image?: string | number | null;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const source =
    typeof image === "number" ? image : image ? { uri: image } : null;

  return (
    <View
      className="items-center justify-center overflow-hidden border-[3px] border-white bg-blue-100"
      style={[
        {
          width: size,
          height: size,
          borderRadius: 10,
        },
        shadow,
      ]}
    >
      {source && !failed ? (
        <Image
          source={source}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          contentPosition="top"
          onError={() => setFailed(true)}
        />
      ) : (
        <Text
          className="font-bold text-blue-700"
          style={{ fontSize: size * 0.36 }}
        >
          {initials}
        </Text>
      )}
    </View>
  );
}

function ActionButton({
  icon,
  color,
  label,
  onPress,
}: {
  icon: IconName;
  color: string;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={label}
      hitSlop={4}
      className="ml-1.5 h-9 w-9 items-center justify-center rounded-full active:scale-90"
      style={{ backgroundColor: color + "1F" }}
    >
      <Ionicons name={icon} size={18} color={color} />
    </Pressable>
  );
}

function InfoRow({
  icon,
  color,
  label,
  value,
  children,
}: {
  icon: IconName;
  color: string;
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-3 flex-row items-center rounded-2xl bg-slate-50 p-3">
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: color + "1F" }}
      >
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          {label}
        </Text>
        <Text
          selectable
          numberOfLines={1}
          adjustsFontSizeToFit
          className="mt-0.5 text-[15px] font-semibold text-slate-800"
        >
          {value}
        </Text>
      </View>
      <View className="flex-row">{children}</View>
    </View>
  );
}

function Chip({
  icon,
  color,
  text,
}: {
  icon: IconName;
  color: string;
  text: string;
}) {
  return (
    <View
      className="mx-1 flex-row items-center rounded-full px-3 py-1"
      style={{ backgroundColor: color + "1A" }}
    >
      <Ionicons name={icon} size={13} color={color} />
      <Text className="ml-1 text-xs font-semibold" style={{ color }}>
        {text}
      </Text>
    </View>
  );
}

export default function ContactModal({ person, visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        className="flex-1 items-center justify-center px-5"
        style={{ backgroundColor: "rgba(15,23,42,0.6)" }}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {person && (
          <Animated.View
            entering={enter}
            className="w-full overflow-hidden rounded-[28px] bg-white"
            style={[{ maxWidth: 380 }, shadow]}
          >
            {/* Header: photo on the left, info on the right */}
            <LinearGradient
              colors={["#0B3D91", "#1E6FE8"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 16, paddingVertical: 20, overflow: "hidden" }}
            >
              <View
                style={{
                  position: "absolute",
                  right: -30,
                  top: -40,
                  width: 130,
                  height: 130,
                  borderRadius: 65,
                  backgroundColor: "rgba(255,255,255,0.14)",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  left: -20,
                  bottom: -55,
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: "rgba(255,255,255,0.09)",
                }}
              />

              <Pressable
                onPress={onClose}
                hitSlop={10}
                className="absolute right-3 top-3 h-8 w-8 items-center justify-center rounded-full bg-white/20 active:bg-white/30"
              >
                <Ionicons name="close" size={18} color="#fff" />
              </Pressable>

              <View className="flex-row items-center">
                <Avatar name={person.name} image={person.image} size={76} />

                <View className="ml-4 flex-1 pr-8">
                  <Text
                    numberOfLines={2}
                    className="text-lg font-bold leading-6 text-white"
                  >
                    {person.name}
                  </Text>
                  {!!person.designation && (
                    <Text
                      numberOfLines={2}
                      className="mt-0.5 text-[13px] font-semibold text-blue-100"
                    >
                      {person.designation}
                    </Text>
                  )}
                  {!!person.office && (
                    <View className="mt-1.5 flex-row items-center">
                      <Ionicons
                        name="business-outline"
                        size={13}
                        color="rgba(255,255,255,0.85)"
                      />
                      <Text
                        numberOfLines={2}
                        className="ml-1.5 flex-1 text-xs text-white/90"
                      >
                        {person.office}
                      </Text>
                    </View>
                  )}
                  {!!person.university && (
                    <View className="mt-1 flex-row items-center">
                      <Ionicons
                        name="school-outline"
                        size={13}
                        color="rgba(255,255,255,0.7)"
                      />
                      <Text
                        numberOfLines={2}
                        className="ml-1.5 flex-1 text-xs text-white/70"
                      >
                        {person.university}
                      </Text>
                    </View>
                  )}

                  {(person.extension || person.bloodGroup) && (
                    <View className="mt-2 flex-row flex-wrap">
                      {!!person.extension && (
                        <View className="mr-2 flex-row items-center rounded-full bg-white/20 px-2.5 py-0.5">
                          <Ionicons name="keypad" size={11} color="#fff" />
                          <Text className="ml-1 text-[11px] font-semibold text-white">
                            Ext. {person.extension}
                          </Text>
                        </View>
                      )}
                      {!!person.bloodGroup && (
                        <View className="mr-2 flex-row items-center rounded-full bg-white/20 px-2.5 py-0.5">
                          <Ionicons name="water" size={11} color="#FCA5A5" />
                          <Text className="ml-1 text-[11px] font-semibold text-white">
                            {person.bloodGroup}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </LinearGradient>

            {/* Body */}
            <View className="px-5 pb-5 pt-4">
              <View className="mb-3 w-full flex-row items-center">
                <View className="h-px flex-1 bg-slate-200" />
                <Text className="mx-3 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Contact Information
                </Text>
                <View className="h-px flex-1 bg-slate-200" />
              </View>

              {!!person.mobile && (
                <InfoRow
                  icon="call"
                  color="#16A34A"
                  label="mobile"
                  value={person.mobile}
                >
                  <ActionButton
                    icon="call"
                    color="#16A34A"
                    label="Call"
                    onPress={() => callNumber(person.mobile!)}
                  />
                  <ActionButton
                    icon="chatbubble-ellipses"
                    color="#2563EB"
                    label="Send message"
                    onPress={() => sendSms(person.mobile!)}
                  />
                  <ActionButton
                    icon="logo-whatsapp"
                    color="#25D366"
                    label="WhatsApp"
                    onPress={() => openWhatsApp(person.mobile!)}
                  />
                </InfoRow>
              )}
              {!!person.email && (
                <InfoRow
                  icon="mail"
                  color="#EA4335"
                  label="Email"
                  value={person.email}
                >
                  <ActionButton
                    icon="mail"
                    color="#EA4335"
                    label="Send email"
                    onPress={() => sendEmail(person.email!)}
                  />
                </InfoRow>
              )}

              <Pressable
                onPress={onClose}
                className="mt-1 w-full active:scale-[0.98] active:opacity-90"
              >
                <LinearGradient
                  colors={["#1E6FE8", "#0B3D91"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 999,
                    paddingVertical: 13,
                    alignItems: "center",
                  }}
                >
                  <Text className="text-base font-bold tracking-wide text-white">
                    Close
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}
