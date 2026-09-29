import type { Ionicons } from '@expo/vector-icons';
import type { OrganizationType } from '@/types/organization';

export type TypeMeta = {
  apiType: OrganizationType;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: [string, string];
};

export const TYPE_META: Record<string, TypeMeta> = {
  faculties: { apiType: 'FACULTY', title: 'Faculties', icon: 'school', colors: ['#E11D48', '#FB7185'] },
  offices: { apiType: 'OFFICE', title: 'Offices', icon: 'business', colors: ['#2563EB', '#60A5FA'] },
  institutes: { apiType: 'INSTITUTE', title: 'Institutes', icon: 'book', colors: ['#16A34A', '#4ADE80'] },
  halls: { apiType: 'HALL', title: 'Halls', icon: 'home', colors: ['#EA580C', '#FB923C'] },
  laboratories: { apiType: 'LABORATORY', title: 'Laboratories', icon: 'flask', colors: ['#7C3AED', '#C084FC'] },
};