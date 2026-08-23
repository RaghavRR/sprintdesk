import rawMockData from '@/data/mock-data.json';
import type { Task, User, Sprint, Comment, AppNotification } from '@/types';


interface MockDataShape {
  users: User[];
  sprints: Sprint[];
  tasks: Task[];
  comments: Comment[];
  notifications: AppNotification[];
}

const mockData = rawMockData as unknown as MockDataShape;

const SIMULATED_LATENCY_MS = 350;

function simulateNetwork<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), SIMULATED_LATENCY_MS);
  });
}

export function fetchAllUsers(): Promise<User[]> {
  return simulateNetwork(mockData.users);
}

export function fetchAllSprints(): Promise<Sprint[]> {
  return simulateNetwork(mockData.sprints);
}

export function fetchBoardTasks(limit = 30): Promise<Task[]> {
  const tasks = [...mockData.tasks].sort((a, b) => a.id - b.id).slice(0, limit);
  return simulateNetwork(tasks);
}

export function fetchAllComments(): Promise<Comment[]> {
  return simulateNetwork(mockData.comments);
}

export function fetchInitialNotifications(): Promise<AppNotification[]> {
  return simulateNetwork(mockData.notifications);
}
