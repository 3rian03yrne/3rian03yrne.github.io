import * as React from 'react';
export interface SectionHeaderProps {
  /** ALL-CAPS eyebrow, e.g. "BRIDGE CONSOLE · COOL" */
  kicker?: string;
  title?: string;
  /** right-aligned telemetry, e.g. "STARDATE 57436.2" */
  meta?: string;
  /** compact variant for panel headers */
  small?: boolean;
  style?: React.CSSProperties;
}
/** Kicker + Heading + right-aligned metadata. The standard section opener. */
export declare function SectionHeader(props: SectionHeaderProps): JSX.Element;
