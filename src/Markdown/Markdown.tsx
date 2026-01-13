import { FC, PropsWithChildren, useContext, useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import { Plugin } from 'unified';
import { CodeHighlighter } from './CodeHighlighter';
import { cn, Redact } from 'reablocks';
import { TableComponent, TableHeaderCell, TableDataCell } from './Table';
import { ChatContext } from '@/ChatContext';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
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

  /**
   * Custom components to override default markdown rendering.
   * These will be merged with the default components.
   */
  customComponents?: Components;
}

export const Markdown: FC<MarkdownWrapperProps> = ({
  children,
  remarkPlugins,
  rehypePlugins = [rehypeRaw, rehypeKatex],
  customComponents
}) => {
  const { theme, markdownComponents } = useContext(ChatContext);

  const components = useMemo<Components>(() => {
    const defaultComponents: Components = {
      code: ({ className, children, ...props }) => (
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
      ),
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
      ),
      redact: (props: any) => (
        <Redact
          value={props['data-redact-value'] || props.children}
          allowToggle={true}
          tooltipText={`${props['data-redact-name'] || 'Sensitive'} information - Click to toggle`}
        />
      )
    };

    // Merge: defaults < context components < prop components
    return {
      ...defaultComponents,
      ...markdownComponents,
      ...customComponents
    };
  }, [theme, markdownComponents, customComponents]);

  return (
    <ReactMarkdown
      remarkPlugins={remarkPlugins as Plugin[]}
      rehypePlugins={rehypePlugins as Plugin[]}
      components={components}
    >
      {children as string}
    </ReactMarkdown>
  );
};
