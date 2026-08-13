import * as React from 'react';
export interface TerminalWindowProps {
  /** centered chrome caption, e.g. "zsh" or "~/uss-cerritos". Default "zsh" */
  title?: string;
  /** fixed width; omit to fill the container */
  width?: number | string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
/** Floating terminal window — themed traffic dots, void body, the system's only shadow. */
export declare function TerminalWindow(props: TerminalWindowProps): JSX.Element;
