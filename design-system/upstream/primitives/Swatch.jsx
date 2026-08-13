import React from 'react';
export function Swatch({ label, hex, size = 128, showHex = true, style }) {
  return <div style={{ width: size, fontFamily: 'var(--font-mono)', ...style }}>
    <div style={{ height: size / 2, borderRadius: 'var(--radius-swatch)', background: hex, border: 'var(--border-swatch)' }}></div>
    <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-label)', color: 'var(--text-1)', letterSpacing: 'var(--track-label)', textTransform: 'uppercase' }}>{label}</div>
    {showHex && <div style={{ fontSize: 'var(--text-label)', color: 'var(--text-dim)' }}>{hex}</div>}
  </div>;
}
