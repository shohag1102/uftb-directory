export type PersonCategory =
  | "TEACHER"
  | "OFFICER"
  | "STAFF"
  | "ADMIN";

export type Person = {
  id: string;
  name: string;
  category: PersonCategory;

  office?: string;
  university?: string;

  designation: string;
  organizationUnitId: string;

  phone?: string | null;
  email?: string | null;
  bloodGroup?: string | null;
  extension?: string | null;

  image?: string | null;
};