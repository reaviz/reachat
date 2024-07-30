import React, { FC, PropsWithChildren, ReactElement } from 'react';
import { Button, cn } from 'reablocks';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import CopyIcon from '@/assets/copy.svg?react';

export interface CodeHighlighterProps extends PropsWithChildren {
  /**
   * The class name to apply to the code block.
   */
  className?: string;

  /**
   * The language of the code block.
   */
  language?: string;

  /**
   * The class name to apply to the copy button.
   */
  copyClassName?: string;

  /**
   * Icon to show for copy.
   */
  copyIcon?: ReactElement;
}

export const CodeHighlighter: FC<CodeHighlighterProps> = ({
  className,
  children,
  copyClassName,
  copyIcon = <CopyIcon />,
  language
}) => {
  const match = language?.match(/language-(\w+)/);
  const lang = match ? match[1] : 'text';

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

  return (
    <div className={cn('relative', className)}>
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
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
