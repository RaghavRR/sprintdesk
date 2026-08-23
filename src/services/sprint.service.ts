import { fetchAllSprints } from '@/services/dataSource';
import type { Sprint } from '@/types';

export function getSprints(): Promise<Sprint[]> {
  return fetchAllSprints();
}
