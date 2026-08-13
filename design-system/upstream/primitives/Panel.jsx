import React from 'react';
import { SectionHeader } from '../typography/SectionHeader.jsx';
export function Panel({ children, kicker, title, meta, style }) {
  return <div style={{ border: 'var(--border-hairline)', borderRadius: 'var(--radius-panel)', background: 'var(--void)', overflow: 'hidden', ...style }}>
    <div style={{ padding: 'var(--pad-panel)' }}>
      {(kicker || title || meta) && <SectionHeader small kicker={kicker} title={title} meta={meta} style={{ marginBottom: 'var(--space-6)' }} />}
      {children}
    </div>
  </div>;
}
