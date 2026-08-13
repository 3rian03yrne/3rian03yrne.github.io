import * as React from 'react';
export interface HeadingProps {
  children?: React.ReactNode;
  /** 1 = 40px display · 2 = 26px panel title */
  level?: 1 | 2;
  color?: string;
  style?: React.CSSProperties;
}
/** Michroma title. Two sizes only — the system has no h3+. */
export declare function Heading(props: HeadingProps): JSX.Element;
