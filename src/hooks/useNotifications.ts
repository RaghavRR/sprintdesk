import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInitialNotifications, pollNotificationFeed } from '@/services/notification.service';
import { useNotificationStore } from '@/stores/notificationStore';
import { useToast } from '@/hooks/useToast';

const POLL_INTERVAL_MS = 15_000;

export function useNotifications() {
  const { notifications, seeded, seed, addNotifications, panelOpen, visibleCount, markRead, markAllRead, loadMore } =
    useNotificationStore();
  const toast = useToast();
  const isFirstPoll = useRef(true);

  const initialQuery = useQuery({
    queryKey: ['notifications', 'initial'],
    queryFn: getInitialNotifications,
    enabled: !seeded,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!seeded && initialQuery.data) seed(initialQuery.data);
  }, [seeded, initialQuery.data, seed]);

  const pollQuery = useQuery({
    queryKey: ['notifications', 'poll'],
    queryFn: pollNotificationFeed,
    enabled: seeded,
    refetchInterval: POLL_INTERVAL_MS,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!pollQuery.data) return;
    const added = addNotifications(pollQuery.data);
    if (added.length > 0 && !isFirstPoll.current && !panelOpen) {
      toast.info(
        added.length === 1 ? added[0].title : `${added.length} new notifications`,
        added.length === 1 ? added[0].message : 'Open the notification bell to view them.',
      );
    }
    isFirstPoll.current = false;
  }, [pollQuery.data]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const visible = notifications.slice(0, visibleCount);
  const hasMore = notifications.length > visibleCount;

  return {
    notifications: visible,
    totalCount: notifications.length,
    unreadCount,
    hasMore,
    isLoading: !seeded && initialQuery.isLoading,
    isError: !seeded && initialQuery.isError,
    markRead,
    markAllRead,
    loadMore,
  };
}
