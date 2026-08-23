import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { PriorityBreakdownDatum } from '@/features/analytics/selectors';
import { ChartCard } from '@/features/analytics/components/ChartCard';
import { chartTooltipStyle, chartTooltipLabelStyle } from '@/features/analytics/chartTheme';

export function PriorityBreakdownChart({ data }: { data: PriorityBreakdownDatum[] }) {
  return (
    <ChartCard title="Priority Breakdown" subtitle="Task priorities across columns">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-ink-950/10 dark:stroke-paper-100/10" />
          <XAxis dataKey="status" tick={{ fontSize: 12, fill: 'var(--chart-tooltip-text)', opacity: 0.6 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--chart-tooltip-text)', opacity: 0.6 }} />
          <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--chart-tooltip-text)' }} />
          <Bar dataKey="low" stackId="p" fill="#9ca3af" isAnimationActive animationDuration={600} />
          <Bar dataKey="medium" stackId="p" fill="#3b82f6" isAnimationActive animationDuration={600} />
          <Bar dataKey="high" stackId="p" fill="#ef4444" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={600} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
