import React from 'react';
import { CodeBlock } from '../console/CodeBlock.jsx';
export function ConfigFile({ filename, children, code, style }) {
  return <CodeBlock filename={filename} code={code ?? children} style={style} />;
}
