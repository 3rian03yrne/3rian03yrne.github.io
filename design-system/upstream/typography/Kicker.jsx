import React from 'react';
export function Kicker({ children, size = 'md', color, style }) {
  const sizes = {
    sm: { fontSize: 'var(--text-kicker-sm)', letterSpacing: 'var(--track-kicker-xs)' },
    md: { fontSize: 'var(--text-kicker-sm)', letterSpacing: 'var(--track-kicker-sm)' },
    lg: { fontSize: 'var(--text-kicker)', letterSpacing: 'var(--track-kicker)' },
  };
  return <div style={{ fontFamily: 'var(--font-display)', color: color || 'var(--text-dim)', textTransform: 'uppercase', ...sizes[size], ...style }}>{children}</div>;
}
