export type PersonCategory =
  | "TEACHER"
  | "OFFICER"
  | "EMPLOYEE"
  | "ADMIN";

export type Person = {
  id: string;
  name: string;
  category: PersonCategory;

  office?: string;
  university?: string;

  designation: string;
  organizationUnitId: string;

  mobile?: string | null;
  email?: string | null;
  bloodGroup?: string | null;
  extension?: string | null;

  image?: string | null;
};