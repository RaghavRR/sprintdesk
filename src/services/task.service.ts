import { fetchBoardTasks, fetchAllComments } from '@/services/dataSource';
import type { Task, Comment } from '@/types';


export function getInitialBoardTasks(): Promise<Task[]> {
  return fetchBoardTasks(30);
}

export function getInitialComments(): Promise<Comment[]> {
  return fetchAllComments();
}
