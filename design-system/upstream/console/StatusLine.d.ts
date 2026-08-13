import * as React from 'react';
export interface StatusLineProps {
  /** slanted lead badge. Default "CLAUDE" */
  lead?: string;
  model?: string;
  cost?: string;
  /** context gauge, e.g. "92k / 200k" */
  trail?: string;
  /** context-usage band — drives the trailing pill's fill. Pill shape only. */
  level?: 'nominal' | 'steady' | 'warn' | 'critical';
  /** powerline = slanted lead + piped middle · pill = four detached capsules */
  shape?: 'powerline' | 'pill';
  style?: React.CSSProperties;
}
/** Claude Code statusline. */
export declare function StatusLine(props: StatusLineProps): JSX.Element;
