import { Stack } from 'expo-router';
import AppHeader from '@/components/AppHeader';

export default function DirectoryLayout() {
  return <Stack screenOptions={{ header: (props) => <AppHeader {...props} /> }} />;
}