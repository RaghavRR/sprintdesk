import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Task, Comment, TaskStatus, TaskPriority, NewTaskInput } from '@/types';

interface BoardFilters {
  priority: TaskPriority | 'all';
  assigneeId: number | 'all';
}

interface BoardState {
  tasks: Task[];
  comments: Comment[];
  hydrated: boolean;
  selectedTaskId: number | null;
  filters: BoardFilters;
  taskPendingDelete: number | null;

  hydrate: (tasks: Task[], comments: Comment[]) => void;
  moveTask: (taskId: number, toStatus: TaskStatus, toIndex: number) => void;
  addTask: (input: NewTaskInput) => Task;
  updateTask: (id: number, patch: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  addComment: (taskId: number, authorId: number, message: string) => void;
  setSelectedTaskId: (id: number | null) => void;
  setFilters: (filters: Partial<BoardFilters>) => void;
  requestDelete: (id: number | null) => void;
}

function normalizeOrder(tasks: Task[]): Task[] {
  const byStatus = new Map<TaskStatus, Task[]>();
  for (const task of tasks) {
    const bucket = byStatus.get(task.status) ?? [];
    bucket.push(task);
    byStatus.set(task.status, bucket);
  }

  const result: Task[] = [];
  for (const bucket of byStatus.values()) {
    bucket
      .sort((a, b) => a.order - b.order)
      .forEach((task, index) => result.push({ ...task, order: index }));
  }
  return result;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      tasks: [],
      comments: [],
      hydrated: false,
      selectedTaskId: null,
      taskPendingDelete: null,
      filters: { priority: 'all', assigneeId: 'all' },

      hydrate: (tasks, comments) => {
        if (get().hydrated) return; 
        set({ tasks: normalizeOrder(tasks), comments, hydrated: true });
      },

      moveTask: (taskId, toStatus, toIndex) => {
        set((state) => {
          const moving = state.tasks.find((t) => t.id === taskId);
          if (!moving) return state;

          const now = new Date().toISOString();
          const wasDone = moving.status === 'done';
          const willBeDone = toStatus === 'done';

          const updatedMoving: Task = {
            ...moving,
            status: toStatus,
            order: toIndex - 0.5,
            updatedAt: now,
            completedAt: willBeDone && !wasDone ? now : willBeDone ? moving.completedAt : null,
          };

          const rest = state.tasks.filter((t) => t.id !== taskId);
          const destColumn = rest.filter((t) => t.status === toStatus).sort((a, b) => a.order - b.order);
          const others = rest.filter((t) => t.status !== toStatus);

          const clampedIndex = Math.max(0, Math.min(toIndex, destColumn.length));
          destColumn.splice(clampedIndex, 0, updatedMoving);

          const merged = [...others, ...destColumn];
          return { tasks: normalizeOrder(merged) };
        });
      },

      addTask: (input) => {
        const state = get();
        const nextId = state.tasks.length > 0 ? Math.max(...state.tasks.map((t) => t.id)) + 1 : 1;
        const now = new Date().toISOString();
        const backlogCount = state.tasks.filter((t) => t.status === 'backlog').length;

        const newTask: Task = {
          id: nextId,
          title: input.title,
          description: input.description ?? '',
          status: 'backlog',
          priority: input.priority,
          assigneeId: input.assigneeId,
          dueDate: input.dueDate,
          sprintId: 3,
          order: backlogCount,
          createdAt: now,
          completedAt: null,
          updatedAt: now,
        };

        set({ tasks: normalizeOrder([...state.tasks, newTask]) });
        return newTask;
      },

      updateTask: (id, patch) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t,
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: normalizeOrder(state.tasks.filter((t) => t.id !== id)),
          comments: state.comments.filter((c) => c.taskId !== id),
          selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
          taskPendingDelete: null,
        }));
      },

      addComment: (taskId, authorId, message) => {
        set((state) => {
          const nextId = state.comments.length > 0 ? Math.max(...state.comments.map((c) => c.id)) + 1 : 1;
          const comment: Comment = {
            id: nextId,
            taskId,
            authorId,
            message,
            createdAt: new Date().toISOString(),
          };
          return { comments: [...state.comments, comment] };
        });
      },

      setSelectedTaskId: (id) => set({ selectedTaskId: id }),
      setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
      requestDelete: (id) => set({ taskPendingDelete: id }),
    }),
    {
      name: 'sprintdesk.board',
      partialize: (state) => ({
        tasks: state.tasks,
        comments: state.comments,
        hydrated: state.hydrated,
      }),
    },
  ),
);
