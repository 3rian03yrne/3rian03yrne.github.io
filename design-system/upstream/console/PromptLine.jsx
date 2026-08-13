import React from 'react';
import { SegmentBar } from './SegmentBar.jsx';
const KIND_STYLES = {
  path: { bg: 'var(--prompt-path-bg)', fg: 'var(--prompt-path-fg)', weight: 700, padding: '5px 16px', radius: 'var(--radius-seg) 0 0 var(--radius-seg)' },
  git: { bg: 'var(--prompt-git-bg)', fg: 'var(--prompt-git-fg)', weight: 500, padding: '5px 16px' },
  ok: { bg: 'var(--prompt-ok-bg)', fg: 'var(--prompt-ok-fg)', weight: 700, padding: '5px 14px', radius: '0 var(--radius-seg) var(--radius-seg) 0' },
  time: { fg: 'var(--text-dim)', weight: 400, padding: '5px 8px' },
};
const DEFAULT_SEGMENTS = [
  { label: '~/uss-cerritos', kind: 'path' },
  { label: '⎇ main', kind: 'git' },
  { label: '✓', kind: 'ok' },
  { label: '184ms', kind: 'time' },
];
export function PromptLine({ segments = DEFAULT_SEGMENTS, shape = 'powerline', style }) {
  return <SegmentBar shape={shape} style={style} segments={segments.map(s => ({ label: s.label, ...KIND_STYLES[s.kind || 'time'] }))} />;
}
