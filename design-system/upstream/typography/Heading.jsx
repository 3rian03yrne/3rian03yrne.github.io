import React from 'react';
export function Heading({ children, level = 1, color, style }) {
  const Tag = level === 1 ? 'h1' : 'h2';
  const fs = level === 1 ? 'var(--text-display)' : 'var(--text-panel-title)';
  const track = level === 1 ? 'var(--track-display)' : 'var(--track-panel)';
  return <Tag style={{ fontFamily: 'var(--font-display)', fontSize: fs, lineHeight: 'var(--leading-display)', letterSpacing: track, color: color || 'var(--text-1)', margin: 0, fontWeight: 400, ...style }}>{children}</Tag>;
}
