import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CompletionTrendDatum } from '@/features/analytics/selectors';
import { ChartCard } from '@/features/analytics/components/ChartCard';
import { chartTooltipStyle, chartTooltipLabelStyle } from '@/features/analytics/chartTheme';
import { EmptyState } from '@/components/ui/EmptyState';

export function CompletionTrendChart({ data }: { data: CompletionTrendDatum[] }) {
  if (data.length === 0) {
    return (
      <ChartCard title="Completion Trend" subtitle="Task completions over time">
        <div className="flex h-full items-center justify-center">
          <EmptyState title="No completed tasks yet" description="Completed tasks will appear here over time." />
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Completion Trend" subtitle="Task completions over time">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-ink-950/10 dark:stroke-paper-100/10" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--chart-tooltip-text)', opacity: 0.6 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--chart-tooltip-text)', opacity: 0.6 }} />
          <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
          <Line
            type="monotone"
            dataKey="completed"
            stroke="#F5A623"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive
            animationDuration={600}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
