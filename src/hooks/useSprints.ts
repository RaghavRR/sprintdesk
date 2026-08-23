import { useQuery } from '@tanstack/react-query';
import { getSprints } from '@/services/sprint.service';

export function useSprints() {
  return useQuery({ queryKey: ['sprints'], queryFn: getSprints, staleTime: Infinity });
}
