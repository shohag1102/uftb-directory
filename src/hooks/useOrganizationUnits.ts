import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { OrganizationType, OrganizationUnit } from '@/types/organization';

export function useOrganizationUnits(type: OrganizationType) {
  const [data, setData] = useState<OrganizationUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    api
      .get<OrganizationUnit[]>('/api/organization-units', { params: { type } })
      .then((res) => active && setData(res.data))
      .catch((e) => active && setError(e?.message ?? 'Failed to load'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [type]);

  return { data, loading, error };
}