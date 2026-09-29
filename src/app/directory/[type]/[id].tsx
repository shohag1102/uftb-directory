import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useOrganizationUnit, useUnitPeople } from '@/hooks/useOrganizationUnit';
import { PERSON_TABS, type Employee, type PersonTab } from '@/constants/personCategories';
import { useContactModal } from '@/hooks/useContactModal';
import { TYPE_META } from '@/constants/organizationTypeMap';
import { resolveImageUrl } from '@/lib/resolveImageUrl';

const TAB_ICON: Record<PersonTab, keyof typeof Ionicons.glyphMap> = {
  ALL: 'apps',
  TEACHER: 'school',
  OFFICER: 'briefcase',
  STAFF: 'people',
  ADMIN: 'shield-checkmark',
};

function Avatar({ name, image }: { name: string; image?: string | null }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  return (
    <View className="h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-100">
      {image ? (
        <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
      ) : (
        <Text className="text-sm font-bold text-blue-700">{initials}</Text>
      )}
    </View>
  );
}

function PersonCard({ person, onPress }: { person: Employee; onPress: () => void }) {
  return (
    <View
      className="mb-3 rounded-2xl bg-white p-4"
      style={{ shadowColor: '#0F172A', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 2 }}
    >
      <View className="flex-row items-center">
        <Avatar name={person.name} image={person.image} />
        <View className="ml-3 flex-1">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={14} color="#2563EB" />
            <Text numberOfLines={1} className="ml-1 flex-1 text-[15px] font-bold text-slate-800">
              {person.name}
            </Text>
          </View>
          <View className="mt-1 flex-row items-center">
            <Ionicons name="briefcase-outline" size={13} color="#64748B" />
            <Text numberOfLines={1} className="ml-1.5 flex-1 text-[13px] text-slate-500">
              {person.designation}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={onPress}
        className="mt-3 flex-row items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 active:bg-slate-100"
      >
        <Text className="text-[13px] font-semibold text-blue-600">Show contact details</Text>
        <Ionicons name="chevron-forward" size={16} color="#2563EB" />
      </Pressable>
    </View>
  );
}

export default function UnitDetailScreen() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const meta = TYPE_META[type ?? ''];
  const { unit, loading: unitLoading } = useOrganizationUnit(id);
  const { openContact } = useContactModal();
  const [tab, setTab] = useState<PersonTab>('ALL');
  const { people, loading, error } = useUnitPeople(id, tab);

  console.log("People:", people);


  return (
    <View className="flex-1 bg-slate-100">
      <Stack.Screen
        options={
          {
            title: 'DU Directory',
            hideMenuButton: true,
            rightHref: '/directory',
            rightIcon: 'grid-outline',
          } as any
        }
      />

      {!unitLoading && unit && (
        <View className="mx-5 mt-4 flex-row items-center self-start rounded-2xl border border-blue-200 bg-white px-4 py-2.5">
          <Ionicons name={meta?.icon ?? 'business'} size={18} color="#2563EB" />
          <Text className="ml-2 text-[15px] font-semibold text-blue-700">{unit.name}</Text>
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-5 py-4">
        {PERSON_TABS.map((t) => {
          const active = t.value === tab;
          return (
            <Pressable
              key={t.value}
              onPress={() => setTab(t.value)}
              className={`mr-2 flex-row items-center rounded-full px-4 py-2 ${
                active ? 'bg-blue-600' : 'border border-slate-200 bg-white'
              }`}
            >
              <Ionicons name={TAB_ICON[t.value]} size={14} color={active ? '#fff' : '#64748B'} />
              <Text className={`ml-1.5 text-[13px] font-semibold ${active ? 'text-white' : 'text-slate-600'}`}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

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
          data={people}
          keyExtractor={(p) => p.id}
          contentContainerClassName="px-5 pb-8"
          renderItem={({ item }) => (
            <PersonCard
              person={item}
              onPress={() =>
                openContact({
                  id: item.id,
                  name: item.name,
                  designation: item.designation,
                  office: unit?.name,
                  university: 'University of Frontier Technology',
                //   image: item.image,
                //   image: "http://172.17.102.175:5000/images/employees/1790672000456.jpg",
                  image: resolveImageUrl(item.image),
                  mobile: item.mobile ?? undefined,
                  email: item.email ?? undefined,
                  extension: item.extension ?? undefined,
                  bloodGroup: item.bloodGroup ?? undefined,
                })
              }
            />
          )}
          ListEmptyComponent={<Text className="mt-10 text-center text-slate-400">No people found.</Text>}
        />
      )}
    </View>
  );
}