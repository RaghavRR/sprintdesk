import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { VelocityDatum } from '@/features/analytics/selectors';
import { ChartCard } from '@/features/analytics/components/ChartCard';
import { chartTooltipStyle, chartTooltipLabelStyle } from '@/features/analytics/chartTheme';

export function SprintVelocityChart({ data }: { data: VelocityDatum[] }) {
  return (
    <ChartCard title="Sprint Velocity" subtitle="Completed tasks per sprint">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-ink-950/10 dark:stroke-paper-100/10" />
          <XAxis dataKey="sprint" tick={{ fontSize: 12, fill: 'var(--chart-tooltip-text)', opacity: 0.6 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--chart-tooltip-text)', opacity: 0.6 }} />
          <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
          <Bar dataKey="completed" fill="#F5A623" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={600} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
