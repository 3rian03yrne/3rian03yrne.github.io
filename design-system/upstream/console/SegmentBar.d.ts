import * as React from 'react';
export interface Segment {
  label: React.ReactNode;
  /** background fill; omit for a transparent trailing segment */
  bg?: string;
  fg?: string;
  weight?: number;
  padding?: string;
  /** powerline shape only — pill shape forces --radius-pill */
  radius?: string;
  /** powerline shape only: clip-path cap, e.g. var(--pl-slant-lead) */
  clip?: string;
  /** powerline shape only: pull left by --pl-overlap so a slanted cap tucks under its neighbour */
  overlap?: boolean;
}
export interface SegmentBarProps {
  segments?: Segment[];
  /** powerline = butted blocks, slanted caps · pill = detached capsules, 4px gap */
  shape?: 'powerline' | 'pill';
  style?: React.CSSProperties;
}
/** The signature motif. Two geometries over one segment model; PromptLine and StatusLine compose it. */
export declare function SegmentBar(props: SegmentBarProps): JSX.Element;
