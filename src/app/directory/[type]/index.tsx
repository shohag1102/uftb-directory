import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrganizationUnits } from '@/hooks/useOrganizationUnits';
import { TYPE_META } from '@/constants/organizationTypeMap';

export default function UnitListScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const meta = TYPE_META[type ?? ''];
  const { data, loading, error } = useOrganizationUnits(meta?.apiType ?? 'OFFICE');

  return (
    <View className="flex-1 bg-slate-100">
      <Stack.Screen
        options={
          {
            title: meta?.title ?? 'Directory',
            hideMenuButton: true,
            rightHref: '/directory',
            rightIcon: 'grid-outline',
          } as any
        }
      />

      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      )}

      {!loading && error && (
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="cloud-offline-outline" size={40} color="#94A3B8" />
          <Text className="mt-3 text-center text-slate-500">{error}</Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-5 pt-5 pb-8"
          ItemSeparatorComponent={() => <View className="h-3" />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => router.push(`/directory/${type}/${item.id}` as Href)}
              className="flex-row items-center rounded-2xl bg-white p-4 active:scale-[0.98] active:opacity-90"
              style={{
                shadowColor: '#0F172A',
                shadowOpacity: 0.06,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 3 },
                elevation: 2,
              }}
            >
              <View
                className="h-11 w-11 items-center justify-center rounded-xl"
                style={{ backgroundColor: (meta?.colors[0] ?? '#2563EB') + '1F' }}
              >
                <Ionicons name={meta?.icon ?? 'business'} size={22} color={meta?.colors[0] ?? '#2563EB'} />
              </View>
              <Text className="ml-3 flex-1 text-[15px] font-semibold text-slate-800">{item.name}</Text>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </Pressable>
          )}
          ListEmptyComponent={<Text className="mt-10 text-center text-slate-400">No records found.</Text>}
        />
      )}
    </View>
  );
}