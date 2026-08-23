import type { ReactNode } from 'react';
import { SkeletonRow } from '@/components/ui/Skeleton';

export interface DataTableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
  caption?: string;
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  isLoading,
  emptyMessage = 'No records found.',
  caption,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ink-950/10 dark:border-paper-100/10">
      <table className="w-full min-w-[480px] text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-ink-950/[0.03] font-mono text-xs uppercase tracking-wide text-ink-600 dark:bg-paper-100/[0.03] dark:text-paper-100/50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} scope="col" className="px-4 py-3 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-950/8 dark:divide-paper-100/8">
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} columns={columns.length} />)}

          {!isLoading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-ink-600 dark:text-paper-100/50">
                {emptyMessage}
              </td>
            </tr>
          )}

          {!isLoading &&
            rows.map((row) => (
              <tr key={getRowId(row)} className="bg-white hover:bg-ink-950/[0.02] dark:bg-ink-950 dark:hover:bg-paper-100/[0.03]">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-ink-700 dark:text-paper-200 ${col.className ?? ''}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
