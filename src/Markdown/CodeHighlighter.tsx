import React, { useRef, FC, useLayoutEffect, PropsWithChildren } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { cn } from 'reablocks';

export interface CodeHighlighterProps extends PropsWithChildren {
  /**
   * The class name to apply to the code block.
   */
  className?: string;
}

export const CodeHighlighter: FC<CodeHighlighterProps> = ({ className, children }) => {
  const codeBlockRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    hljs.highlightElement(codeBlockRef.current);
  }, []);

  return (
    <code ref={codeBlockRef} className={cn(className)}>
      {children}
    </code>
  );
};
