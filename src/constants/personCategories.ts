export const PERSON_TABS = [
  { label: "All", value: "ALL" },
  { label: "Teachers", value: "TEACHER" },
  { label: "Officers", value: "OFFICER" },
  { label: "Staff", value: "STAFF" },
  { label: "Admin", value: "ADMIN" },
] as const;

export type PersonTab = (typeof PERSON_TABS)[number]["value"];