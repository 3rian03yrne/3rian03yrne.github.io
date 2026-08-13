import React from 'react';
export function Pill({ children, tone = 'secondary', style }) {
  const tones = {
    primary: { background: 'var(--accent)', color: 'var(--status-lead-fg)' },
    secondary: { background: 'var(--accent-2)', color: 'var(--ink-on-accent)' },
    tertiary: { background: 'var(--accent-3)', color: 'var(--ink-on-accent)' },
    dim: { background: 'var(--surface-chip)', color: 'var(--text-1)' },
  };
  return <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 'var(--text-label)', letterSpacing: 'var(--track-caps)', textTransform: 'uppercase', padding: '4px 14px', borderRadius: 'var(--radius-pill)', ...tones[tone], ...style }}>{children}</span>;
}
