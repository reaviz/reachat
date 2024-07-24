import { FC, PropsWithChildren } from 'react';
import ReactMarkdown from 'react-markdown';
import { PluggableList } from 'react-markdown/lib';
import remarkGfm from 'remark-gfm';
import { CodeHighlighter } from './CodeHighlighter';
import { cn } from 'reablocks';

interface MarkdownWrapperProps extends PropsWithChildren {
  /**
   * Remark plugins to apply to the markdown content.
   */
  remarkPlugins?: PluggableList[];
}

export const Markdown: FC<MarkdownWrapperProps> = ({
  children,
  remarkPlugins = [remarkGfm]
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins as PluggableList}
      components={{
        code: props => (
          <CodeHighlighter
            {...props}
            className={cn('mt-3 rounded')}
          />
        )
      }}
    >
      {children as string}
    </ReactMarkdown>
  );
};
