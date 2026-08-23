import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppNotification } from '@/types';

interface NotificationState {
  notifications: AppNotification[];
  seeded: boolean;
  panelOpen: boolean;
  visibleCount: number;

  seed: (initial: AppNotification[]) => void;
  addNotifications: (incoming: AppNotification[]) => AppNotification[];
  markRead: (id: number) => void;
  markAllRead: () => void;
  setPanelOpen: (open: boolean) => void;
  loadMore: () => void;
}

const PAGE_SIZE = 20;

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],
      seeded: false,
      panelOpen: false,
      visibleCount: PAGE_SIZE,

      seed: (initial) => {
        if (get().seeded) return;
        set({ notifications: [...initial].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), seeded: true });
      },

      addNotifications: (incoming) => {
        const existingIds = new Set(get().notifications.map((n) => n.id));
        const fresh = incoming.filter((n) => !existingIds.has(n.id));
        if (fresh.length > 0) {
          set((state) => ({ notifications: [...fresh, ...state.notifications] }));
        }
        return fresh;
      },

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      markAllRead: () =>
        set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })),

      setPanelOpen: (open) => set({ panelOpen: open }),

      loadMore: () => set((state) => ({ visibleCount: state.visibleCount + PAGE_SIZE })),
    }),
    { name: 'sprintdesk.notifications' },
  ),
);
