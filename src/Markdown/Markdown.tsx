import './Markdown.css';

import { cn, Redact } from 'reablocks';
import type { FC, PropsWithChildren } from 'react';
import { useMemo } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkYoutube from 'remark-youtube';
import type { Plugin } from 'unified';

import type { MarkdownTheme } from './types';

import { CodeHighlighter } from './CodeHighlighter';
import { TableComponent, TableDataCell, TableHeaderCell } from './Table';

const defaultRemarkPlugins: Plugin[] = [remarkGfm, remarkYoutube, remarkMath];

interface MarkdownWrapperProps extends PropsWithChildren {
  /**
   * Remark plugins to apply to the markdown content.
   * @default [remarkGfm, remarkYoutube, remarkMath]
   */
  remarkPlugins?: Plugin[];

  /**
   * Rehype plugins to apply to the markdown content.
   * @default [rehypeRaw, rehypeKatex]
   */
  rehypePlugins?: Plugin[];

  /**
   * Theme to apply to the markdown content.
   */
  theme: MarkdownTheme;

  /**
   * Custom components to override default markdown rendering.
   * These will be merged with the default components.
   */
  customComponents?: Components;
}

export const Markdown: FC<MarkdownWrapperProps> = ({
  children,
  remarkPlugins = defaultRemarkPlugins,
  rehypePlugins = [rehypeRaw, rehypeKatex],
  theme,
  customComponents
}) => {
  const components = useMemo<Components>(() => {
    const defaultComponents: Record<string, any> = {
      code: ({ className, children, ...props }) => (
        <CodeHighlighter
          {...props}
          language={cn(className)}
          inlineClassName={cn(theme.inlineCode)}
          className={cn(theme.code, className)}
          copyClassName={cn(theme.copy)}
          toolbarClassName={cn(theme.toolbar)}
        >
          {children}
        </CodeHighlighter>
      ),
      table: props => <TableComponent {...props} className={cn(theme.table)} />,
      th: props => <TableHeaderCell {...props} className={cn(theme.th)} />,
      td: props => <TableDataCell {...props} className={cn(theme.td)} />,
      a: props => <a {...props} className={cn(theme.a)} />,
      hr: props => <hr {...props} className={cn(theme.hr)} />,
      p: props => <p {...props} className={cn(theme.p)} />,
      li: props => <li {...props} className={cn(theme.li)} />,
      ul: props => <ul {...props} className={cn(theme.ul)} />,
      ol: props => <ol {...props} className={cn(theme.ol)} />,
      h1: props => <h1 {...props} className={cn(theme.h1)} />,
      h2: props => <h2 {...props} className={cn(theme.h2)} />,
      h3: props => <h3 {...props} className={cn(theme.h3)} />,
      h4: props => <h4 {...props} className={cn(theme.h4)} />,
      h5: props => <h5 {...props} className={cn(theme.h5)} />,
      h6: props => <h6 {...props} className={cn(theme.h6)} />,
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

    // Merge: defaults < prop components
    return {
      ...defaultComponents,
      ...customComponents
    };
  }, [theme, customComponents]);

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
