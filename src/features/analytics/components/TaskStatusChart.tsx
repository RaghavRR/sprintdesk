import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { StatusDistributionDatum } from '@/features/analytics/selectors';
import { ChartCard } from '@/features/analytics/components/ChartCard';
import { chartTooltipStyle, chartTooltipLabelStyle } from '@/features/analytics/chartTheme';

const COLORS = ['#8A8F9C', '#2F6FED', '#8B5CF6', '#1F9D55'];

export function TaskStatusChart({ data }: { data: StatusDistributionDatum[] }) {
  return (
    <ChartCard title="Task Status" subtitle="Distribution across board columns">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={2}
            isAnimationActive
            animationDuration={600}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} />
          <Legend wrapperStyle={{ fontSize: 12, color: 'var(--chart-tooltip-text)' }} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
