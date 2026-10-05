import AppHeader from "@/components/AppHeader";
import { Stack } from "expo-router";

export default function NoticeLayout() {
  return (
    <Stack screenOptions={{ header: (props) => <AppHeader {...props} /> }} />
  );
}
