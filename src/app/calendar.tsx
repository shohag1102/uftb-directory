import NoConnectionState from "@/components/NoConnectionState";
import { useCalendarYear } from "@/hooks/useCalendar";
import { BN_MONTHS, toBn } from "@/lib/bn";
import {
  buildDayMap,
  dateKey,
  eventsInMonth,
  monthCells,
} from "@/lib/calendar";
import { Ionicons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const RED = "#DC2626";
const BLUE = "#3B82F6";
const NAVY = "#0B3D91";
const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEK_BN = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহস্পতি", "শুক্র", "শনি"];
const shadow = {
  shadowColor: "#0F172A",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 3,
};

export default function CalendarScreen() {
  const now = new Date();
  const YEAR = now.getFullYear();
  const todayKey = dateKey(YEAR, now.getMonth(), now.getDate());
  const [cursor, setCursor] = useState({ y: YEAR, m: now.getMonth() });

  const { data, loading, error, refetch } = useCalendarYear(YEAR);
  const weekend = data?.weekendDays ?? [4, 5];
  const dayMap = useMemo(() => buildDayMap(data?.events ?? []), [data]);
  const cells = useMemo(() => monthCells(cursor.y, cursor.m), [cursor]);
  const monthEvents = useMemo(
    () => eventsInMonth(data?.events ?? [], cursor.y, cursor.m),
    [data, cursor],
  );

  const canPrev = cursor.m > 0;
  const canNext = cursor.m < 11;
  const isThisMonth = cursor.m === now.getMonth();

  const go = (delta: number) =>
    setCursor((c) => {
      const m = c.m + delta;
      return m < 0 || m > 11 ? c : { y: YEAR, m };
    });

  const fmt = (iso: string) => {
    const [, mm, dd] = iso.split("-").map(Number);
    return `${toBn(dd)} ${BN_MONTHS[mm - 1]}`;
  };
  const range = (from: string, to: string) =>
    from === to ? fmt(from) : `${fmt(from)} - ${fmt(to)}`;

  return (
    <>
      <Stack.Screen
        options={
          {
            title: "UFTB Calendar",
            onRefresh: refetch,
            refreshing: loading,
          } as any
        }
      />
      <ScrollView
        className="flex-1 bg-slate-100"
        contentContainerClassName="p-4 pb-8"
      >
        {/* Calendar card */}
        <View className="overflow-hidden rounded-2xl bg-white" style={shadow}>
          {/* White header */}
          <View className="flex-row items-center justify-between border-b border-slate-100 px-3 py-3">
            <Pressable
              onPress={() => go(-1)}
              disabled={!canPrev}
              hitSlop={10}
              className="h-9 w-9 items-center justify-center rounded-full bg-blue-50 active:opacity-70"
              style={{ opacity: canPrev ? 1 : 0.3 }}
            >
              <Ionicons name="chevron-back" size={20} color={NAVY} />
            </Pressable>

            <View className="items-center">
              <Text className="text-lg font-bold text-slate-800">
                {BN_MONTHS[cursor.m]} {toBn(cursor.y)}
              </Text>
            </View>

            <Pressable
              onPress={() => go(1)}
              disabled={!canNext}
              hitSlop={10}
              className="h-9 w-9 items-center justify-center rounded-full bg-blue-50 active:opacity-70"
              style={{ opacity: canNext ? 1 : 0.3 }}
            >
              <Ionicons name="chevron-forward" size={20} color={NAVY} />
            </Pressable>
          </View>

          <View className="px-3 pb-3 pt-3">
            {/* Weekday labels */}
            <View className="flex-row">
              {WEEK_BN.map((w, i) => (
                <Text
                  key={w}
                  className="flex-1 text-center text-xs font-semibold"
                  style={{ color: weekend.includes(i) ? RED : "#94A3B8" }}
                >
                  {w}
                </Text>
              ))}
            </View>

            {/* Grid */}
            <Animated.View
              key={`${cursor.y}-${cursor.m}`}
              entering={FadeIn.duration(220)}
              className="mt-2"
            >
              {Array.from({ length: cells.length / 7 }, (_, row) => (
                <View key={row} className="flex-row">
                  {cells.slice(row * 7, row * 7 + 7).map((d, col) => {
                    if (!d)
                      return (
                        <View
                          key={col}
                          className="flex-1"
                          style={{ height: 44 }}
                        />
                      );

                    const key = dateKey(cursor.y, cursor.m, d);
                    const info = dayMap[key];
                    const isWeekend = weekend.includes(col);
                    const isToday = key === todayKey;
                    const fill = info
                      ? info.kind === "HOLIDAY"
                        ? RED
                        : BLUE
                      : undefined;
                    const textColor = fill
                      ? "#fff"
                      : isWeekend
                        ? RED
                        : "#1E293B";

                    return (
                      <View
                        key={col}
                        className="flex-1 items-center justify-center"
                        style={{ height: 44 }}
                      >
                        <View
                          className="items-center justify-center rounded-full"
                          style={{
                            width: 36,
                            height: 36,
                            backgroundColor: fill,
                            borderWidth: isToday ? 2 : 0,
                            borderColor: NAVY,
                          }}
                        >
                          <Text
                            style={{
                              color: textColor,
                              fontWeight: isToday ? "800" : "500",
                              fontSize: 15,
                            }}
                          >
                            {toBn(d)}
                          </Text>
                          {isToday && (
                            <View
                              style={{
                                position: "absolute",
                                bottom: 3,
                                width: 4,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: fill ? "#fff" : NAVY,
                              }}
                            />
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))}
            </Animated.View>

            {/* Legend + Today */}
            <View className="mt-3 flex-row items-center justify-between border-t border-slate-100 pt-3">
              <View className="flex-row items-center" style={{ gap: 12 }}>
                <Legend color={RED} label="Holiday" />
                <Legend color={BLUE} label="Vacation" />
                <Legend color="#fff" label="Today" ring />
              </View>
              {!isThisMonth && (
                <Pressable
                  onPress={() => setCursor({ y: YEAR, m: now.getMonth() })}
                  className="rounded-full bg-blue-50 px-3 py-1.5 active:opacity-80"
                >
                  <Text className="text-xs font-semibold text-blue-700">
                    Today
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>

        {/* Off-days list */}
        <View className="mt-4 rounded-2xl bg-white p-4" style={shadow}>
          <View className="mb-2 flex-row items-center">
            <Ionicons name="calendar-outline" size={18} color={NAVY} />
            <Text className="ml-2 text-base font-bold text-slate-800 w-[90%]">
              {BN_MONTHS[cursor.m]} মাসের ছুটির তালিকা
            </Text>
          </View>

          {loading && !data ? (
            <ActivityIndicator className="my-6" color="#1E6FE8" />
          ) : error && !data ? (
            <NoConnectionState />
          ) : monthEvents.length === 0 ? (
            <Text className="py-4 text-center text-sm text-slate-400">
              এই মাসে কোনো ছুটি নেই
            </Text>
          ) : (
            monthEvents.map((e, i) => {
              const c = e.type === "HOLIDAY" ? RED : BLUE;
              return (
                <View
                  key={e.id}
                  className={`flex-row items-start py-2.5 ${i > 0 ? "border-t border-slate-100" : ""}`}
                >
                  <View
                    style={{
                      width: 4,
                      alignSelf: "stretch",
                      borderRadius: 2,
                      backgroundColor: c,
                    }}
                  />
                  <View className="ml-3 flex-1">
                    <Text
                      className="text-[15px] font-semibold"
                      style={{ color: c }}
                    >
                      {e.title}
                    </Text>
                    <Text className="mt-0.5 text-xs text-slate-500">
                      {range(e.from, e.to)}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </>
  );
}

function Legend({
  color,
  label,
  ring,
}: {
  color: string;
  label: string;
  ring?: boolean;
}) {
  return (
    <View className="flex-row items-center">
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          borderWidth: ring ? 2 : 0,
          borderColor: NAVY,
        }}
      />
      <Text className="ml-1.5 text-xs text-slate-500">{label}</Text>
    </View>
  );
}
