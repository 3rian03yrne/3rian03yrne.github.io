import * as React from 'react';
export interface KickerProps {
  children?: React.ReactNode;
  /** sm 11px/0.18em · md 11px/0.2em · lg 13px/0.25em */
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  style?: React.CSSProperties;
}
/** ALL-CAPS Michroma eyebrow above a heading. Always letter-spaced. */
export declare function Kicker(props: KickerProps): JSX.Element;
