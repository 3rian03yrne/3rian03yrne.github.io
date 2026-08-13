import * as React from 'react';
export interface ConfigFileProps {
  /** the real path, e.g. "~/.config/ghostty/config" */
  filename: string;
  code?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
/** A named config file on the spec sheet. Thin semantic wrapper over CodeBlock — use it when the content is a real, copy-pasteable config. */
export declare function ConfigFile(props: ConfigFileProps): JSX.Element;
