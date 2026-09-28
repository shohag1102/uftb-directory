import AppHeader from "@/components/AppHeader";
import { DrawerProvider } from "@/components/DrawerContext";
import { CopyrightFooter } from "@/components/Footers";
import Sidebar from "@/components/Sidebar";
import { ContactModalProvider } from "@/hooks/useContactModal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import "../global.css";

export default function RootLayout() {
  return (
    <DrawerProvider>
      <ContactModalProvider>
        <View className="flex-1">
          <StatusBar style="light" />

          <View className="flex-1">
            <Stack
              screenOptions={{ header: (props) => <AppHeader {...props} /> }}
            >
              <Stack.Screen name="index" options={{ title: "UFTB Info" }} />
              <Stack.Screen name="directory" options={{ title: "Directory" }} />
              <Stack.Screen name="about" options={{ title: "About" }} />
            </Stack>
            <CopyrightFooter />
          </View>

          {/* Must be last so it draws over the header and footer */}
          <Sidebar />
        </View>
      </ContactModalProvider>
    </DrawerProvider>
  );
}
