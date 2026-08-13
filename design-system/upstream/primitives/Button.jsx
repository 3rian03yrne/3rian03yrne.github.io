import React from 'react';
export function Button({ children, variant = 'primary', size = 'md', disabled, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const pad = size === 'sm' ? '5px 14px' : '8px 22px';
  const fs = size === 'sm' ? 'var(--text-kicker-sm)' : 'var(--text-code)';
  const variants = {
    primary: { background: 'var(--accent)', color: 'var(--status-lead-fg)', border: '1px solid transparent' },
    secondary: { background: 'var(--accent-2)', color: 'var(--ink-on-accent)', border: '1px solid transparent' },
    ghost: { background: 'transparent', color: 'var(--text-1)', border: '1px solid var(--surface-chip)' },
  };
  return <button disabled={disabled} onClick={onClick}
    onMouseEnter={() => setHover(true)} onMouseLeave={() => { setHover(false); setPress(false); }}
    onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)}
    style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: fs, letterSpacing: 'var(--track-caps)', textTransform: 'uppercase', padding: pad, borderRadius: 'var(--radius-seg)', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, filter: press ? 'brightness(0.85)' : hover && !disabled ? 'brightness(1.1)' : 'none', ...variants[variant], ...style }}>{children}</button>;
}
