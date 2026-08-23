import { Select } from '@/components/ui/Select';
import { useBoardStore } from '@/stores/boardStore';
import { PRIORITY_LABELS } from '@/types';
import type { User } from '@/types';

export function BoardFilters({ users }: { users: User[] }) {
  const filters = useBoardStore((s) => s.filters);
  const setFilters = useBoardStore((s) => s.setFilters);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="w-40">
        <Select
          label="Priority"
          value={filters.priority}
          onChange={(e) => setFilters({ priority: e.target.value as typeof filters.priority })}
          options={[{ value: 'all', label: 'All priorities' }, ...Object.entries(PRIORITY_LABELS).map(([value, label]) => ({ value, label }))]}
        />
      </div>
      <div className="w-48">
        <Select
          label="Assignee"
          value={String(filters.assigneeId)}
          onChange={(e) => setFilters({ assigneeId: e.target.value === 'all' ? 'all' : Number(e.target.value) })}
          options={[{ value: 'all', label: 'Everyone' }, ...users.map((u) => ({ value: String(u.id), label: u.name }))]}
        />
      </div>
    </div>
  );
}
