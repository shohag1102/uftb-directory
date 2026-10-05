import type { CalendarEvent, CalendarEventType } from "@/types/calendar";

export type DayInfo = { kind: CalendarEventType; titles: string[] };

const DAY = 86400000;
const toUtc = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
export const pad = (n: number) => String(n).padStart(2, "0");
export const dateKey = (y: number, m: number, d: number) =>
  `${y}-${pad(m + 1)}-${pad(d)}`;

/** Expands ranges into a { 'YYYY-MM-DD': DayInfo } map. HOLIDAY beats VACATION. */
export function buildDayMap(events: CalendarEvent[]) {
  const map: Record<string, DayInfo> = {};
  for (const e of events) {
    for (let t = toUtc(e.from); t <= toUtc(e.to); t += DAY) {
      const key = new Date(t).toISOString().slice(0, 10);
      const cur = map[key];
      if (!cur) map[key] = { kind: e.type, titles: [e.title] };
      else {
        cur.titles.push(e.title);
        if (e.type === "HOLIDAY") cur.kind = "HOLIDAY";
      }
    }
  }
  return map;
}

/** Cells for a month grid: null = empty slot. Length is a multiple of 7. */
export function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(first).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (cells.length % 7) cells.push(null);
  return cells;
}

export const eventsInMonth = (
  events: CalendarEvent[],
  year: number,
  month: number,
) => {
  const start = dateKey(year, month, 1);
  const end = dateKey(year, month, new Date(year, month + 1, 0).getDate());
  return events.filter((e) => e.from <= end && e.to >= start);
};
