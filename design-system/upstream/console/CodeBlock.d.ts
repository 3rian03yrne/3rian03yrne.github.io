import * as React from 'react';
export interface CodeBlockProps {
  /** path caption in the chrome bar, e.g. "~/.zshrc" */
  filename?: string;
  /** code as a string; alternatively pass children */
  code?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
/** Neutral code surface. Uses the --page-* chrome ramp, not the theme palette — code reads the same under both themes. */
export declare function CodeBlock(props: CodeBlockProps): JSX.Element;
