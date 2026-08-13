import * as React from 'react';
export interface SwatchProps {
  /** ALL-CAPS role name, e.g. "CYAN ACCENT" */
  label: string;
  /** any CSS color; rendered verbatim as the caption */
  hex: string;
  /** width in px; the chip is half this tall. Default 128 */
  size?: number;
  showHex?: boolean;
  style?: React.CSSProperties;
}
/** Color chip with role label and hex caption. Hairline border keeps dark chips visible. */
export declare function Swatch(props: SwatchProps): JSX.Element;
