import {
  shareViaEmail,
  shareViaFacebook,
  shareViaLinkedIn,
  shareViaWhatsApp,
} from "@/lib/newsShare";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  id: string;
};

const OPTIONS = [
  { key: "email", label: "Email", icon: "mail" as const, color: "#EA4335" },
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: "logo-whatsapp" as const,
    color: "#25D366",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: "logo-facebook" as const,
    color: "#1877F2",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: "logo-linkedin" as const,
    color: "#0A66C2",
  },
];

export default function ShareSheet({ visible, onClose, title, id }: Props) {
  const insets = useSafeAreaInsets();

  const handle = (key: string) => {
    onClose();
    if (key === "email") shareViaEmail(title, id);
    if (key === "whatsapp") shareViaWhatsApp(id);
    if (key === "facebook") shareViaFacebook(id);
    if (key === "linkedin") shareViaLinkedIn(id);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(15,23,42,0.5)",
          justifyContent: "flex-end",
        }}
        onPress={onClose}
      >
        <Pressable onPress={() => {}}>
          <View
            className="rounded-t-3xl bg-white px-5 pt-4"
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <View className="mb-4 h-1.5 w-12 self-center rounded-full bg-slate-200" />
            <Text className="mb-5 text-center text-base font-bold text-slate-800">
              Share this news
            </Text>
            <View className="flex-row justify-between">
              {OPTIONS.map((o) => (
                <Pressable
                  key={o.key}
                  onPress={() => handle(o.key)}
                  className="items-center active:opacity-70"
                  style={{ width: "22%" }}
                >
                  <View
                    className="h-14 w-14 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: o.color + "1A" }}
                  >
                    <Ionicons name={o.icon} size={26} color={o.color} />
                  </View>
                  <Text className="mt-2 text-[11px] font-semibold text-slate-600">
                    {o.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
