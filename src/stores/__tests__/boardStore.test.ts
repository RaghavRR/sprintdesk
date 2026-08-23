import { describe, it, expect, beforeEach } from 'vitest';
import { useBoardStore } from '@/stores/boardStore';
import type { Task } from '@/types';

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: 1,
    title: 'Sample task',
    description: '',
    status: 'backlog',
    priority: 'medium',
    assigneeId: 1,
    dueDate: '2026-09-01',
    sprintId: 3,
    order: 0,
    createdAt: '2026-08-01T00:00:00Z',
    completedAt: null,
    updatedAt: '2026-08-01T00:00:00Z',
    ...overrides,
  };
}

describe('boardStore', () => {
  beforeEach(() => {
    useBoardStore.setState({
      tasks: [],
      comments: [],
      hydrated: false,
      selectedTaskId: null,
      taskPendingDelete: null,
      filters: { priority: 'all', assigneeId: 'all' },
    });
  });

  describe('hydrate', () => {
    it('seeds tasks and comments only once', () => {
      const { hydrate } = useBoardStore.getState();
      hydrate([makeTask({ id: 1 })], []);
      hydrate([makeTask({ id: 2 })], []); 

      expect(useBoardStore.getState().tasks).toHaveLength(1);
      expect(useBoardStore.getState().tasks[0].id).toBe(1);
    });
  });

  describe('addTask', () => {
    it('adds a new task to the Backlog column with the next available id', () => {
      useBoardStore.setState({ tasks: [makeTask({ id: 1 })], hydrated: true });

      const created = useBoardStore.getState().addTask({
        title: 'New feature',
        priority: 'high',
        assigneeId: 2,
        dueDate: '2026-09-15',
      });

      expect(created.id).toBe(2);
      expect(created.status).toBe('backlog');
      const stored = useBoardStore.getState().tasks.find((t) => t.id === 2);
      expect(stored).toMatchObject({ title: 'New feature', priority: 'high', assigneeId: 2 });
    });

    it('assigns id 1 when the board is empty', () => {
      const created = useBoardStore.getState().addTask({ title: 'First', priority: 'low', assigneeId: null, dueDate: null });
      expect(created.id).toBe(1);
    });
  });

  describe('moveTask', () => {
    it('moves a task to a different column and updates its status', () => {
      useBoardStore.setState({
        tasks: [makeTask({ id: 1, status: 'backlog', order: 0 })],
        hydrated: true,
      });

      useBoardStore.getState().moveTask(1, 'in-progress', 0);

      const task = useBoardStore.getState().tasks.find((t) => t.id === 1);
      expect(task?.status).toBe('in-progress');
    });

    it('reorders tasks within the same column', () => {
      useBoardStore.setState({
        tasks: [
          makeTask({ id: 1, status: 'backlog', order: 0 }),
          makeTask({ id: 2, status: 'backlog', order: 1 }),
          makeTask({ id: 3, status: 'backlog', order: 2 }),
        ],
        hydrated: true,
      });

      useBoardStore.getState().moveTask(3, 'backlog', 0);

      const backlog = useBoardStore
        .getState()
        .tasks.filter((t) => t.status === 'backlog')
        .sort((a, b) => a.order - b.order)
        .map((t) => t.id);
      expect(backlog).toEqual([3, 1, 2]);
    });

    it('sets completedAt when a task moves into Done, and clears it when moved out', () => {
      useBoardStore.setState({ tasks: [makeTask({ id: 1, status: 'review', order: 0 })], hydrated: true });

      useBoardStore.getState().moveTask(1, 'done', 0);
      expect(useBoardStore.getState().tasks[0].completedAt).not.toBeNull();

      useBoardStore.getState().moveTask(1, 'in-progress', 0);
      expect(useBoardStore.getState().tasks[0].completedAt).toBeNull();
    });
  });

  describe('deleteTask', () => {
    it('removes the task and its comments', () => {
      useBoardStore.setState({
        tasks: [makeTask({ id: 1 }), makeTask({ id: 2 })],
        comments: [{ id: 1, taskId: 1, authorId: 1, message: 'hi', createdAt: '2026-08-01T00:00:00Z' }],
        hydrated: true,
      });

      useBoardStore.getState().deleteTask(1);

      const state = useBoardStore.getState();
      expect(state.tasks.map((t) => t.id)).toEqual([2]);
      expect(state.comments).toHaveLength(0);
    });

    it('clears the selected task when deleting the currently selected task', () => {
      useBoardStore.setState({ tasks: [makeTask({ id: 1 })], selectedTaskId: 1, hydrated: true });

      useBoardStore.getState().deleteTask(1);

      expect(useBoardStore.getState().selectedTaskId).toBeNull();
    });
  });
});
