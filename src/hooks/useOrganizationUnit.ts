import type { Employee, PersonTab } from "@/constants/personCategories";
import { api } from "@/lib/api";
import type { OrganizationUnit } from "@/types/organization";
import { useCallback, useEffect, useState } from "react";

export function useOrganizationUnit(id: string) {
  const [unit, setUnit] = useState<OrganizationUnit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get<OrganizationUnit>(`/api/organization-units/${id}`)
      .then((res) => active && setUnit(res.data))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);
  return { unit, loading };
}

export function useUnitPeople(id: string, tab: PersonTab) {
  const [people, setPeople] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    api
      .get<Employee[]>(`/api/organization-units/${id}/people`, {
        params: tab === "ALL" ? undefined : { category: tab },
      })
      .then((res) => setPeople(res.data))
      .catch((e) => setError(e?.message ?? "Failed to load"))
      .finally(() => setLoading(false));
  }, [id, tab]);

  useEffect(() => {
    load();
  }, [load]);

  return { people, loading, error, reload: load };
}
