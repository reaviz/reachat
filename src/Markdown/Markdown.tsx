import './Markdown.css';

import { cn, Redact } from 'reablocks';
import type { FC, PropsWithChildren } from 'react';
import { useContext, useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import type { Plugin } from 'unified';

import { ChatContext } from '@/ChatContext';
import type { ChatTheme } from '@/theme';

import { CodeHighlighter } from './CodeHighlighter';
import { TableComponent, TableDataCell, TableHeaderCell } from './Table';

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
   * Theme to apply to the markdown content.
   */
  theme?: ChatTheme;

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
  theme: themeProp,
  customComponents
}) => {
  const { theme: contextTheme, markdownComponents } = useContext(ChatContext);
  const theme = themeProp || contextTheme;

  const components = useMemo<Components>(() => {
    const defaultComponents: Record<string, any> = {
      code: ({ className, children, ...props }) => (
        <CodeHighlighter
          {...props}
          language={cn(className)}
          inlineClassName={cn(theme.messages.message.markdown.inlineCode)}
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
      hr: props => (
        <hr {...props} className={cn(theme.messages.message.markdown.hr)} />
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
      h1: props => (
        <h1 {...props} className={cn(theme.messages.message.markdown.h1)} />
      ),
      h2: props => (
        <h2 {...props} className={cn(theme.messages.message.markdown.h2)} />
      ),
      h3: props => (
        <h3 {...props} className={cn(theme.messages.message.markdown.h3)} />
      ),
      h4: props => (
        <h4 {...props} className={cn(theme.messages.message.markdown.h4)} />
      ),
      h5: props => (
        <h5 {...props} className={cn(theme.messages.message.markdown.h5)} />
      ),
      h6: props => (
        <h6 {...props} className={cn(theme.messages.message.markdown.h6)} />
      ),
      // 'redact' is a custom element created by remarkRedact, not a standard
      // HTML tag, so it falls outside react-markdown's Components type.
      redact: ((props: Record<string, unknown>) => (
        <Redact
          value={
            (props['data-redact-value'] as string) || (props.children as string)
          }
          allowToggle={true}
          tooltipText={`${(props['data-redact-name'] as string) || 'Sensitive'} information - Click to toggle`}
        />
      )) as unknown
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
