import * as React from 'react';
export interface PromptSegment {
  label: React.ReactNode;
  /** path = accent block · git = chip · ok = success block · time = transparent trailer */
  kind?: 'path' | 'git' | 'ok' | 'time';
}
export interface PromptLineProps {
  /** defaults to ~/uss-cerritos · ⎇ main · ✓ · 184ms */
  segments?: PromptSegment[];
  /** powerline = butted blocks (starship/Oh My Posh) · pill = detached capsules */
  shape?: 'powerline' | 'pill';
  style?: React.CSSProperties;
}
/** Shell prompt. A kind-driven composition over SegmentBar. */
export declare function PromptLine(props: PromptLineProps): JSX.Element;
