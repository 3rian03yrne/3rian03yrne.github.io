/** Rounded readout label — the pill-shaped console tags from the reference plates ("31 654", "EMRG"). */
export interface PillProps {
  children: React.ReactNode;
  /** primary · secondary (default) · tertiary · dim */
  tone?: 'primary' | 'secondary' | 'tertiary' | 'dim';
  style?: React.CSSProperties;
}
