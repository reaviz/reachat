import { Button, cn } from 'reablocks';
import type { FC, PropsWithChildren, ReactElement } from 'react';
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import CopyIcon from '@/assets/copy.svg?react';

import { dark } from './themes';

export interface CodeHighlighterProps extends PropsWithChildren {
  /**
   * The class name to apply to the code block.
   */
  className?: string;

  /**
   * The class name to apply to the inline code.
   */
  inlineClassName?: string;

  /**
   * The language of the code block.
   */
  language?: string;

  /**
   * The class name to apply to the copy button.
   */
  copyClassName?: string;

  /**
   * The class name to apply to the toolbar.
   */
  toolbarClassName?: string;

  /**
   * Icon to show for copy.
   * @default <CopyIcon />
   */
  copyIcon?: ReactElement;

  /**
   * The theme to use for the code block.
   * @default dark
   */
  theme?: Record<string, string>;
}

export const CodeHighlighter: FC<CodeHighlighterProps> = ({
  className,
  children,
  inlineClassName,
  copyClassName,
  copyIcon = <CopyIcon />,
  language,
  toolbarClassName,
  theme = dark,
  ...props
}) => {
  const match = language?.match(/language-(\w+)/);
  const lang = match ? match[1] : 'text';
  // If we can't match a language type, its probably not a code block
  const isInline = !match;

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

  if (isInline) {
    return (
      <code className={cn(inlineClassName)} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <div className={cn(toolbarClassName)}>
        <div>{lang}</div>
        {copyIcon && (
          <Button
            className={cn(copyClassName)}
            size="small"
            variant="text"
            title="Copy code"
            onClick={() => handleCopy(children as string)}
          >
            {copyIcon}
          </Button>
        )}
      </div>
      <SyntaxHighlighter language={lang} style={theme}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
