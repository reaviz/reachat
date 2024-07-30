import { FC, PropsWithChildren, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { PluggableList } from 'react-markdown/lib';
import remarkGfm from 'remark-gfm';
import { CodeHighlighter } from './CodeHighlighter';
import { cn } from 'reablocks';
import { TableComponent, TableHeaderCell, TableDataCell } from './Table';
import { ChatContext } from '@/ChatContext';

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
  const { theme } = useContext(ChatContext);

  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins as PluggableList}
      components={{
        code: ({ className, ...props }) => (
          <CodeHighlighter
            {...props}
            // Ref: https://github.com/remarkjs/react-markdown?tab=readme-ov-file#use-custom-components-syntax-highlight
            language={className}
            className={cn(theme.messages.message.markdown.code, className)}
            copyClassName={cn(theme.messages.message.markdown.copy)}
          />
        ),
        table: props => <TableComponent {...props} className={cn(theme.messages.message.markdown.table)} />,
        th: props => <TableHeaderCell {...props} className={cn(theme.messages.message.markdown.th)} />,
        td: props => <TableDataCell {...props} className={cn(theme.messages.message.markdown.td)} />,
        a: props => <a {...props} className={cn(theme.messages.message.markdown.a)} />,
        p: props => <p {...props} className={cn(theme.messages.message.markdown.p)} />,
        li: props => <li {...props} className={cn(theme.messages.message.markdown.li)} />,
        ul: props => <ul {...props} className={cn(theme.messages.message.markdown.ul)} />,
        ol: props => <ol {...props} className={cn(theme.messages.message.markdown.ol)} />
      }}
    >
      {children as string}
    </ReactMarkdown>
  );
};
