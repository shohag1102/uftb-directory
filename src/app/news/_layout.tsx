import { Stack } from "expo-router";
import AppHeader from "@/components/AppHeader";

export default function NewsLayout() {
  return (
    <Stack screenOptions={{ header: (props) => <AppHeader {...props} /> }} />
  );
}
