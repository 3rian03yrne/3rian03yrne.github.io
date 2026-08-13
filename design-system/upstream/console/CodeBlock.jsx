import React from 'react';
export function CodeBlock({ filename, code, children, style }) {
  return <div style={{ background: 'var(--page-bg)', border: '1px solid var(--page-line)', borderRadius: 'var(--radius-card)', overflow: 'hidden', fontFamily: 'var(--font-mono)', ...style }}>
    {filename && <div style={{ padding: 'var(--pad-chrome)', background: 'var(--page-panel-2)', fontSize: 'var(--text-kicker-sm)', color: 'var(--page-dim)', letterSpacing: 'var(--track-label)' }}>{filename}</div>}
    <pre style={{ margin: 0, padding: 'var(--space-4)', fontSize: 'var(--text-code)', lineHeight: 'var(--leading-code)', color: 'var(--page-text)', overflowX: 'auto', whiteSpace: 'pre' }}>{code ?? children}</pre>
  </div>;
}
