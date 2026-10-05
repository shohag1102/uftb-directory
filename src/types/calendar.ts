export type CalendarEventType = "HOLIDAY" | "VACATION";
export type CalendarEvent = {
  id: string;
  title: string;
  from: string;
  to: string;
  type: CalendarEventType;
};
export type CalendarData = {
  year: number;
  weekendDays: number[];
  events: CalendarEvent[];
};
export type CalendarResponse = { success: boolean; data: CalendarData };
