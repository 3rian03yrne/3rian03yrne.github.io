import React from 'react';
export function SegmentBar({ segments = [], shape = 'powerline', style }) {
  const pill = shape === 'pill';
  return <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap', gap: pill ? 'var(--space-1)' : 0, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-term)', ...style }}>
    {segments.map((seg, i) => <span key={i} style={{ background: seg.bg ?? 'transparent', color: seg.fg ?? 'var(--text-1)', fontWeight: seg.weight ?? 500, padding: seg.padding ?? (pill ? '4px 14px' : 'var(--pad-segment)'), borderRadius: pill ? 'var(--radius-pill)' : (seg.radius ?? 0), clipPath: pill ? undefined : seg.clip, marginLeft: !pill && seg.overlap ? 'var(--pl-overlap)' : undefined, letterSpacing: 'var(--track-term)', display: 'flex', alignItems: 'center' }}>{seg.label}</span>)}
  </div>;
}
