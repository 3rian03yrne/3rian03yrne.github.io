/** Hairline-bordered console panel with the standard kicker / title / right-aligned meta header. */
export interface PanelProps {
  children: React.ReactNode;
  /** Small caps line above the title, e.g. "BRIDGE CONSOLE · COOL" */
  kicker?: string;
  /** Michroma 26px panel title, e.g. "lcars-padd" */
  title?: string;
  /** Right-aligned telemetry string, e.g. "STARDATE 57436.2" */
  meta?: string;
  style?: React.CSSProperties;
}
