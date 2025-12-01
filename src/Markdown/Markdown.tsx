import './Markdown.css';

import { cn } from 'reablocks';
import type { FC, PropsWithChildren } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import type { Plugin } from 'unified';

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
  theme: ChatTheme;
}

export const Markdown: FC<MarkdownWrapperProps> = ({
  children,
  remarkPlugins,
  rehypePlugins = [rehypeKatex],
  theme
}) => (
  <ReactMarkdown
    remarkPlugins={remarkPlugins as Plugin[]}
    rehypePlugins={rehypePlugins as Plugin[]}
    components={{
      code: ({ className, ...props }) => (
        <CodeHighlighter
          {...props}
          // Ref: https://github.com/remarkjs/react-markdown?tab=readme-ov-file#use-custom-components-syntax-highlight
          language={className}
          className={cn(theme.messages.message.markdown.code, className)}
          copyClassName={cn(theme.messages.message.markdown.copy)}
          toolbarClassName={cn(theme.messages.message.markdown.toolbar)}
        />
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
      )
    }}
  >
    {children as string}
  </ReactMarkdown>
);
