export type OrganizationType =
  | "FACULTY"
  | "DEPARTMENT"
  | "OFFICE"
  | "SUB_OFFICE"
  | "HALL"
  | "SECTION"
  | "INSTITUTE"
  | "RESEARCH_CENTER"
  | "LABORATORY";

export type OrganizationUnit = {
  id: string;
  name: string;
  type: OrganizationType;
  parentId: string | null;

  logo?: string | null;
  icon?: string | null;
};
