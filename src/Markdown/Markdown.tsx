import { FC, PropsWithChildren, useContext } from 'react';
import ReactMarkdown from 'react-markdown';
import { Plugin } from 'unified';
import { CodeHighlighter } from './CodeHighlighter';
import {
  ChartRenderer,
  parseChartConfig,
  isChartCodeBlock
} from './ChartRenderer';
import { cn } from 'reablocks';
import { TableComponent, TableHeaderCell, TableDataCell } from './Table';
import { ChatContext } from '@/ChatContext';
import rehypeKatex from 'rehype-katex';
import './Markdown.css';

interface MarkdownWrapperProps extends PropsWithChildren {
  /**
   * Remark plugins to apply to the markdown content.
   */
  remarkPlugins?: Plugin[];

  /**
   * Rehype plugins to apply to the markdown content.
   */
  rehypePlugins?: Plugin[];
}

export const Markdown: FC<MarkdownWrapperProps> = ({
  children,
  remarkPlugins,
  rehypePlugins = [rehypeKatex]
}) => {
  const { theme } = useContext(ChatContext);

  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins as Plugin[]}
      rehypePlugins={rehypePlugins as Plugin[]}
      components={{
        code: ({ className, children, ...props }) => {
          // Check if this is a chart code block
          if (isChartCodeBlock(className)) {
            const chartConfig = parseChartConfig(String(children));
            if (chartConfig) {
              return <ChartRenderer config={chartConfig} className="my-4" />;
            }
          }

          return (
            <CodeHighlighter
              {...props}
              // Ref: https://github.com/remarkjs/react-markdown?tab=readme-ov-file#use-custom-components-syntax-highlight
              language={className}
              className={cn(theme.messages.message.markdown.code, className)}
              copyClassName={cn(theme.messages.message.markdown.copy)}
              toolbarClassName={cn(theme.messages.message.markdown.toolbar)}
            >
              {children}
            </CodeHighlighter>
          );
        },
        table: props => (
          <TableComponent
            {...props}
            className={cn(theme.messages.message.markdown.table)}
          />
        ),
        th: props => (
          <TableHeaderCell
            {...props}
            className={cn(theme.messages.message.markdown.th)}
          />
        ),
        td: props => (
          <TableDataCell
            {...props}
            className={cn(theme.messages.message.markdown.td)}
          />
        ),
        a: props => (
          <a {...props} className={cn(theme.messages.message.markdown.a)} />
        ),
        p: props => (
          <p {...props} className={cn(theme.messages.message.markdown.p)} />
        ),
        li: props => (
          <li {...props} className={cn(theme.messages.message.markdown.li)} />
        ),
        ul: props => (
          <ul {...props} className={cn(theme.messages.message.markdown.ul)} />
        ),
        ol: props => (
          <ol {...props} className={cn(theme.messages.message.markdown.ol)} />
        )
      }}
    >
      {children as string}
    </ReactMarkdown>
  );
};
