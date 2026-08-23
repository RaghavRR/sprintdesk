import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInitialBoardTasks, getInitialComments } from '@/services/task.service';
import { useBoardStore } from '@/stores/boardStore';

export function useBoardData() {
  const hydrated = useBoardStore((s) => s.hydrated);
  const hydrate = useBoardStore((s) => s.hydrate);

  const tasksQuery = useQuery({
    queryKey: ['board', 'initial-tasks'],
    queryFn: getInitialBoardTasks,
    enabled: !hydrated,
    staleTime: Infinity,
  });

  const commentsQuery = useQuery({
    queryKey: ['board', 'initial-comments'],
    queryFn: getInitialComments,
    enabled: !hydrated,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!hydrated && tasksQuery.data && commentsQuery.data) {
      hydrate(tasksQuery.data, commentsQuery.data);
    }
  }, [hydrated, tasksQuery.data, commentsQuery.data, hydrate]);

  return {
    isLoading: !hydrated && (tasksQuery.isLoading || commentsQuery.isLoading),
    isError: !hydrated && (tasksQuery.isError || commentsQuery.isError),
    refetch: () => {
      tasksQuery.refetch();
      commentsQuery.refetch();
    },
  };
}
