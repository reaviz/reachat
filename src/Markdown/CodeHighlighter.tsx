import React, { useRef, FC, useLayoutEffect, PropsWithChildren, ReactElement } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';
import { Button, cn } from 'reablocks';
import CopyIcon from '@/assets/copy.svg?react';

export interface CodeHighlighterProps extends PropsWithChildren {
  /**
   * The class name to apply to the code block.
   */
  className?: string;

  /**
   * The class name to apply to the copy button.
   */
  copyClassName?: string;

  /**
   * Icon to show for copy.
   */
  copyIcon?: ReactElement;
}

export const CodeHighlighter: FC<CodeHighlighterProps> = ({ className, children, copyClassName, copyIcon = <CopyIcon /> }) => {
  const codeBlockRef = useRef<HTMLElement | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Text copied to clipboard');
      })
      .catch(err => {
        console.error('Could not copy text: ', err);
      });
  };

  useLayoutEffect(() => {
    hljs.highlightElement(codeBlockRef.current);
  }, []);

  return (
    <div className={cn('relative', className)}>
      {copyIcon && (
        <Button
          className={cn(copyClassName)}
          size="small"
          variant="text"
          title="Copy code"
          onClick={() => handleCopy(codeBlockRef.current.textContent)}
        >
          {copyIcon}
        </Button>
      )}
      <code ref={codeBlockRef}>
        {children}
      </code>
    </div>
  );
};
