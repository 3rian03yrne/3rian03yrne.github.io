import React from 'react';
import { Kicker } from './Kicker.jsx';
import { Heading } from './Heading.jsx';
export function SectionHeader({ kicker, title, meta, small, style }) {
  return <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-4)', ...style }}>
    <div>
      {kicker && <Kicker size={small ? 'sm' : 'lg'} style={{ marginBottom: 'var(--space-2)' }}>{kicker}</Kicker>}
      {title && <Heading level={small ? 2 : 1}>{title}</Heading>}
    </div>
    {meta && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-code)', color: 'var(--text-dim)', letterSpacing: '0.08em' }}>{meta}</div>}
  </div>;
}
