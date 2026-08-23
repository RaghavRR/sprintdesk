import axios from 'axios';
import { fetchInitialNotifications } from '@/services/dataSource';
import type { AppNotification } from '@/types';

const notificationsFeed = axios.create({
  baseURL: import.meta.env.VITE_NOTIFICATIONS_API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
});

interface JsonPlaceholderPost {
  id: number;
  title: string;
  body: string;
}

const POLL_ID_OFFSET = 100000;

function toNotification(post: JsonPlaceholderPost): AppNotification {
  return {
    id: POLL_ID_OFFSET + post.id,
    title: post.title.length > 60 ? `${post.title.slice(0, 57)}...` : post.title,
    message: post.body,
    type: 'system',
    read: false,
    createdAt: new Date().toISOString(),
  };
}

export function getInitialNotifications(): Promise<AppNotification[]> {
  return fetchInitialNotifications();
}

export async function pollNotificationFeed(): Promise<AppNotification[]> {
  const { data } = await notificationsFeed.get<JsonPlaceholderPost[]>('/posts', { params: { _limit: 5 } });
  return data.map(toNotification);
}
