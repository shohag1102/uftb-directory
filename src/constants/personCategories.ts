export type PersonCategory = 'TEACHER' | 'OFFICER' | 'EMPLOYEE' | 'ADMIN';

export type Employee = {
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

export const PERSON_TABS = [
  { label: 'All', value: 'ALL' },
  { label: 'Teachers', value: 'TEACHER' },
  { label: 'Officers', value: 'OFFICER' },
  { label: 'Employees', value: 'EMPLOYEE' },
  { label: 'Admin', value: 'ADMIN' },
] as const;

export type PersonTab = (typeof PERSON_TABS)[number]['value'];