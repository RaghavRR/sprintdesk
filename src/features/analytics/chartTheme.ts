import type { CSSProperties } from 'react';

export const chartTooltipStyle: CSSProperties = {
  fontSize: 12,
  borderRadius: 8,
  background: 'var(--chart-tooltip-bg)',
  border: '1px solid var(--chart-tooltip-border)',
  color: 'var(--chart-tooltip-text)',
};

export const chartTooltipLabelStyle: CSSProperties = {
  color: 'var(--chart-tooltip-text)',
};
