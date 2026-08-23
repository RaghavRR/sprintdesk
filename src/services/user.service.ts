import { fetchAllUsers } from '@/services/dataSource';
import type { User } from '@/types';

export function getUsers(): Promise<User[]> {
  return fetchAllUsers();
}
