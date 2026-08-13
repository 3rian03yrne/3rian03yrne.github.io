import React from 'react';
export function TerminalWindow({ title = 'zsh', width, children, style }) {
  const dot = { width: 11, height: 11, borderRadius: 'var(--radius-dot)' };
  return <div style={{ borderRadius: 'var(--radius-term)', overflow: 'hidden', boxShadow: 'var(--shadow-term)', width, fontFamily: 'var(--font-mono)', ...style }}>
    <div style={{ background: 'var(--surface-panel)', padding: 'var(--pad-chrome)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <div style={{ ...dot, background: 'var(--dot-1)' }}></div>
      <div style={{ ...dot, background: 'var(--dot-2)' }}></div>
      <div style={{ ...dot, background: 'var(--dot-3)' }}></div>
      <div style={{ flex: 1, textAlign: 'center', fontSize: 'var(--text-kicker-sm)', color: 'var(--text-dim)', letterSpacing: 'var(--track-caps)' }}>{title}</div>
    </div>
    <div style={{ background: 'var(--surface-void)', padding: 'var(--pad-terminal)', fontSize: 'var(--text-term)', lineHeight: 'var(--leading-term)', color: 'var(--text-1)' }}>{children}</div>
  </div>;
}
