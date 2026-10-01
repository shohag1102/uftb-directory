import { TYPE_META } from "@/constants/organizationTypeMap";
import {
  PERSON_TABS,
  PersonCategory,
  type Employee,
  type PersonTab,
} from "@/constants/personCategories";
import { useContactModal } from "@/hooks/useContactModal";
import {
  useOrganizationUnit,
  useUnitPeople,
} from "@/hooks/useOrganizationUnit";
import { resolveImageUrl } from "@/lib/resolveImageUrl";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, { Easing, Keyframe } from "react-native-reanimated";

const TAB_ICON: Record<PersonTab, keyof typeof Ionicons.glyphMap> = {
  ALL: "apps",
  TEACHER: "school",
  OFFICER: "briefcase",
  EMPLOYEE: "people",
  ADMIN: "shield-checkmark",
};

function Avatar({ name, image }: { name: string; image?: string | null }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const uri = resolveImageUrl(image);

  return (
    <View className="h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-blue-100">
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      ) : (
        <Text className="text-base font-bold text-blue-700">{initials}</Text>
      )}
    </View>
  );
}

function PersonCard({
  person,
  onPress,
}: {
  person: Employee;
  onPress: () => void;
}) {
  return (
    <View
      className="mb-3 rounded-2xl bg-white p-4"
      style={{
        shadowColor: "#0F172A",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 2,
      }}
    >
      <View className="flex-row items-center">
        <Avatar name={person.name} image={person.image} />
        <View className="ml-4 flex-1">
          <View className="flex-row items-center">
            <Ionicons name="checkmark-circle" size={14} color="#2563EB" />
            <Text
              numberOfLines={1}
              className="ml-1 flex-1 text-[15px] font-bold text-slate-800"
            >
              {person.name}
            </Text>
          </View>
          <View className="mt-1 flex-row items-center">
            <Ionicons name="briefcase-outline" size={13} color="#64748B" />
            <Text
              numberOfLines={1}
              className="ml-1.5 flex-1 text-[13px] text-slate-500"
            >
              {person.designation}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={onPress}
        className="mt-3 flex-row items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 active:bg-slate-100"
      >
        <Text className="text-[13px] font-semibold text-blue-600">
          Show contact details
        </Text>
        <Ionicons name="chevron-forward" size={16} color="#2563EB" />
      </Pressable>
    </View>
  );
}

const emptyEnter = new Keyframe({
  0: { opacity: 0, transform: [{ translateY: 12 }, { scale: 0.96 }] },
  100: {
    opacity: 1,
    transform: [{ translateY: 0 }, { scale: 1 }],
    easing: Easing.out(Easing.cubic),
  },
}).duration(400);

function EmptyPeopleState({ label }: { label: string }) {
  return (
    <Animated.View
      entering={emptyEnter}
      className="flex-1 items-center justify-center px-10"
    >
      <View className="h-20 w-20 items-center justify-center rounded-full bg-blue-50">
        <Ionicons name="people-outline" size={36} color="#93C5FD" />
      </View>
      <Text className="mt-4 text-center text-base font-bold text-slate-700">
        No people found
      </Text>
      <Text className="mt-1 text-center text-[13px] leading-5 text-slate-400">
        {label === "ALL"
          ? "This office currently has no listed contacts."
          : "No one in this category yet. Try another tab above."}
      </Text>
    </Animated.View>
  );
}

export default function UnitDetailScreen() {
  const { type, id } = useLocalSearchParams<{ type: string; id: string }>();
  const meta = TYPE_META[type ?? ""];
  const { unit, loading: unitLoading } = useOrganizationUnit(id);
  const { openContact } = useContactModal();
  const [tab, setTab] = useState<PersonTab>("ALL");
  // const [hasAnyPeople, setHasAnyPeople] = useState<boolean | null>(null);
  const { people, loading, error } = useUnitPeople(id, tab);

  // useEffect(() => {
  //   if (tab === "ALL" && !loading && !error && hasAnyPeople === null) {
  //     setHasAnyPeople(people.length > 0);
  //   }
  // }, [tab, loading, error, people, hasAnyPeople]);
  const [availableCategories, setAvailableCategories] = useState<
    PersonCategory[] | null
  >(null);

  useEffect(() => {
    if (tab === "ALL" && !loading && !error && availableCategories === null) {
      const found = Array.from(new Set(people.map((p) => p.category)));
      setAvailableCategories(found);
    }
  }, [tab, loading, error, people, availableCategories]);

  const hasAnyPeople =
    availableCategories === null ? null : availableCategories.length > 0;

  const visibleTabs =
    availableCategories === null
      ? PERSON_TABS.filter((t) => t.value === "ALL") // only show "All" until we know more
      : PERSON_TABS.filter(
          (t) =>
            t.value === "ALL" ||
            availableCategories.includes(t.value as PersonCategory),
        );

  return (
    <View className="flex-1 bg-slate-100">
      <Stack.Screen
        options={
          {
            title: "UFTB Directory",
            hideMenuButton: true,
            rightHref: "/directory",
            rightIcon: "grid-outline",
            subtitle: unit?.data.name,
          } as any
        }
      />

      {/* Compact segmented tabs */}
      {hasAnyPeople !== false && (
        <View className="mx-5 mt-3 flex-row rounded-2xl bg-slate-200/70 p-1">
          {visibleTabs.map((t) => {
            const active = t.value === tab;
            return (
              <Pressable
                key={t.value}
                onPress={() => setTab(t.value)}
                className={`flex-1 flex-row items-center justify-center rounded-xl py-2 ${
                  active ? "bg-white" : ""
                }`}
                style={
                  active
                    ? {
                        shadowColor: "#0F172A",
                        shadowOpacity: 0.12,
                        shadowRadius: 4,
                        elevation: 2,
                      }
                    : undefined
                }
              >
                <Ionicons
                  name={TAB_ICON[t.value]}
                  size={13}
                  color={active ? "#2563EB" : "#64748B"}
                />
                <Text
                  numberOfLines={1}
                  className={`ml-1 text-[12px] ${
                    active
                      ? "font-bold text-blue-600"
                      : "font-medium text-slate-500"
                  }`}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <View className="mt-4" />

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
                  university: "University of Frontier Technology",
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
          ListEmptyComponent={<EmptyPeopleState label={tab} />}
          contentContainerStyle={people.length === 0 ? { flex: 1 } : undefined}
        />
      )}
    </View>
  );
}
